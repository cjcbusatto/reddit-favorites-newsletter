import {
  APIGatewayEvent, APIGatewayProxyResult, Context, Handler
} from "aws-lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { middyfy } from "../../../../core/lambda";
import { UsersRepository } from "../../repositories/UsersRepository";
import { DeleteUserService } from "../../services/DeleteUserService";
import createDynamoDBClient from "../database/db";

export const handler: Handler = middyfy(
  async (
    event: APIGatewayEvent & { pathParameters: { id: string } },
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;

    const repository = new UsersRepository(
      createDynamoDBClient(),
      process.env.USERS_TABLE
    );
    const deleteUserService = new DeleteUserService(repository);

    try {
      const user = await deleteUserService.run(id);
      if (!user) {
        return formatJSONResponse(404, {});
      }
      return formatJSONResponse(200, user);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
