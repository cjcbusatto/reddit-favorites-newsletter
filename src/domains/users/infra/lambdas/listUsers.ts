import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { middyfy } from "../../../../core/lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { UsersRepository } from "../../repositories/UsersRepository";
import createDynamoDBClient from "../database/db";
import { ListUsersService } from "../../services/ListUsersService";

export const handler: Handler = middyfy(
  async (
    _event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const repository = new UsersRepository(
      createDynamoDBClient(),
      process.env.USERS_TABLE
    );
    const listUsersService = new ListUsersService(repository);

    try {
      const user = await listUsersService.run();
      if (!user) {
        return formatJSONResponse(404, {});
      }
      return formatJSONResponse(200, user);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
