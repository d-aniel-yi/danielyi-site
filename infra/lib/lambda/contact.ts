import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const ddb = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME!;

export async function handler(event: any) {
  if (event.requestContext?.http?.method !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: 'Method Not Allowed' };
  }
  try {
    const data = JSON.parse(event.body ?? '{}');
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await ddb.send(new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: id },
        name: { S: String(data.name || '') },
        email: { S: String(data.email || '') },
        message: { S: String(data.message || '') },
        createdAt: { S: createdAt },
      },
    }));
    return {
      statusCode: 202,
      headers: corsHeaders(),
      body: JSON.stringify({ id, status: 'accepted' }),
    };
  } catch (err) {
    return { statusCode: 400, headers: corsHeaders(), body: 'Bad Request' };
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://da.nielyi.com',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-request-id',
  };
}


