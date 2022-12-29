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
import { GetUserByIdService } from "../../services/GetUserByIdService";

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
    const getUserServiceById = new GetUserByIdService(repository);

    try {
      const user = await getUserServiceById.run(id);
      if (!user) {
        return formatJSONResponse(404, {});
      }
      return formatJSONResponse(200, user);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
