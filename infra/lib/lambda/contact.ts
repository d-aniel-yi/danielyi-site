import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

const ddb = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME!;
const rateLimitTableName = process.env.RATE_LIMIT_TABLE_NAME!;

// Rate limits
const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 10;

// Validation constants
const MAX_PAYLOAD_SIZE = 10 * 1024; // 10KB
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

export async function handler(event: any) {
  if (event.requestContext?.http?.method !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: 'Method Not Allowed' };
  }

  // Check payload size
  const bodySize = Buffer.byteLength(event.body || '', 'utf8');
  if (bodySize > MAX_PAYLOAD_SIZE) {
    return { statusCode: 413, headers: corsHeaders(), body: JSON.stringify({ error: 'Payload too large' }) };
  }

  // Extract IP address
  const ip = event.requestContext?.http?.sourceIp || 'unknown';
  
  try {
    // Check rate limits
    const rateLimitCheck = await checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return {
        statusCode: 429,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: 'Too many requests',
          message: rateLimitCheck.message,
          retryAfter: rateLimitCheck.retryAfter,
        }),
      };
    }

    // Parse and validate input
    const data = JSON.parse(event.body ?? '{}');
    const validation = validateInput(data);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Validation failed', details: validation.errors }),
      };
    }

    // Sanitize inputs
    const sanitized = {
      name: sanitizeString(data.name).substring(0, MAX_NAME_LENGTH),
      email: sanitizeString(data.email).substring(0, MAX_EMAIL_LENGTH),
      message: sanitizeString(data.message).substring(0, MAX_MESSAGE_LENGTH),
    };

    // Record submission
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await ddb.send(
      new PutItemCommand({
        TableName: tableName,
        Item: {
          id: { S: id },
          name: { S: sanitized.name },
          email: { S: sanitized.email },
          message: { S: sanitized.message },
          createdAt: { S: createdAt },
          sourceIp: { S: ip },
        },
      })
    );

    // Record rate limit tracking
    await recordRateLimitUsage(ip);

    return {
      statusCode: 202,
      headers: corsHeaders(),
      body: JSON.stringify({ id, status: 'accepted' }),
    };
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  message?: string;
  retryAfter?: number;
}> {
  const now = Date.now();
  const oneHourAgo = now - 3600 * 1000;
  const oneDayAgo = now - 24 * 3600 * 1000;

  try {
    // Query hourly submissions
    const hourlyResult = await ddb.send(
      new QueryCommand({
        TableName: rateLimitTableName,
        KeyConditionExpression: 'pk = :pk AND sk > :hourAgo',
        ExpressionAttributeValues: {
          ':pk': { S: `IP#${ip}` },
          ':hourAgo': { S: String(oneHourAgo) },
        },
      })
    );

    const hourlyCount = hourlyResult.Items?.length || 0;
    if (hourlyCount >= HOURLY_LIMIT) {
      return {
        allowed: false,
        message: `Rate limit exceeded: ${HOURLY_LIMIT} submissions per hour`,
        retryAfter: 3600,
      };
    }

    // Query daily submissions
    const dailyResult = await ddb.send(
      new QueryCommand({
        TableName: rateLimitTableName,
        KeyConditionExpression: 'pk = :pk AND sk > :dayAgo',
        ExpressionAttributeValues: {
          ':pk': { S: `IP#${ip}` },
          ':dayAgo': { S: String(oneDayAgo) },
        },
      })
    );

    const dailyCount = dailyResult.Items?.length || 0;
    if (dailyCount >= DAILY_LIMIT) {
      return {
        allowed: false,
        message: `Rate limit exceeded: ${DAILY_LIMIT} submissions per day`,
        retryAfter: 86400,
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Rate limit check error:', err);
    // On error, allow the request but log the issue
    return { allowed: true };
  }
}

async function recordRateLimitUsage(ip: string): Promise<void> {
  const now = Date.now();
  const ttl = Math.floor(now / 1000) + 86400; // Expire after 24 hours

  await ddb.send(
    new PutItemCommand({
      TableName: rateLimitTableName,
      Item: {
        pk: { S: `IP#${ip}` },
        sk: { S: String(now) },
        ttl: { N: String(ttl) },
      },
    })
  );
}

function validateInput(data: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.push(`Name must be less than ${MAX_NAME_LENGTH} characters`);
  }

  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.push(`Email must be less than ${MAX_EMAIL_LENGTH} characters`);
  } else if (!isValidEmail(data.email)) {
    errors.push('Email must be valid');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message must be less than ${MAX_MESSAGE_LENGTH} characters`);
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

function isValidEmail(email: string): boolean {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(input: any): string {
  if (typeof input !== 'string') return '';
  // Remove null bytes and control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://da.nielyi.com',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-request-id',
  };
}
