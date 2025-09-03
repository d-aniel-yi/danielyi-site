export async function handler(event: any) {
  const method = event?.requestContext?.http?.method;
  if (method !== 'GET') {
    return { statusCode: 405, headers: corsHeaders(event), body: 'Method Not Allowed' };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(event),
    body: JSON.stringify({ status: 'ok', time: new Date().toISOString() }),
  };
}

function corsHeaders(event?: any) {
  const allowedOrigins = new Set([
    'https://da.nielyi.com',
    'https://staging.da.nielyi.com',
  ]);
  const originHeader = event?.headers?.origin || event?.headers?.Origin;
  const allowOrigin = allowedOrigins.has(originHeader) ? originHeader : 'https://da.nielyi.com';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-request-id',
  };
}


