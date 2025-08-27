"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/lambda/contact.ts
var contact_exports = {};
__export(contact_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(contact_exports);
var import_crypto = require("crypto");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var ddb = new import_client_dynamodb.DynamoDBClient({});
var tableName = process.env.TABLE_NAME;
async function handler(event) {
  if (event.requestContext?.http?.method !== "POST") {
    return { statusCode: 405, headers: corsHeaders(), body: "Method Not Allowed" };
  }
  try {
    const data = JSON.parse(event.body ?? "{}");
    const id = (0, import_crypto.randomUUID)();
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    await ddb.send(new import_client_dynamodb.PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: id },
        name: { S: String(data.name || "") },
        email: { S: String(data.email || "") },
        message: { S: String(data.message || "") },
        createdAt: { S: createdAt }
      }
    }));
    return {
      statusCode: 202,
      headers: corsHeaders(),
      body: JSON.stringify({ id, status: "accepted" })
    };
  } catch (err) {
    return { statusCode: 400, headers: corsHeaders(), body: "Bad Request" };
  }
}
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://da.nielyi.com",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-request-id"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
