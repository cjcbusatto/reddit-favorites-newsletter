import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const createDynamoDBClient = (): DocumentClient => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:5000",
      accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
      secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    });
  }

  return new AWS.DynamoDB.DocumentClient();
};

export default createDynamoDBClient;
