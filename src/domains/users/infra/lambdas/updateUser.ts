import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { middyfy } from "../../../../core/lambda";
import { UsersRepository } from "../../repositories/UsersRepository";

import { UpdateUserService } from "../../services/UpdateUserService";
import createDynamoDBClient from "../database/db";
import { CreateUser } from "./dtos/createUserDto";

export const handler: Handler = middyfy(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;
    const { active, favorites } = event.body as any;

    const { USERS_TABLE } = process.env;
    const repository = new UsersRepository(createDynamoDBClient(), USERS_TABLE);
    const updateUserService = new UpdateUserService(repository);

    try {
      const user = await updateUserService.run({ id, active, favorites });

      return formatJSONResponse(200, user);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
