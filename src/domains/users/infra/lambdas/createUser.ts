import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { middyfy } from "../../../../core/lambda";
import { UsersRepository } from "../../repositories/UsersRepository";

import { CreateUserService } from "../../services/CreateUserService";
import createDynamoDBClient from "../database/db";
import { CreateUser } from "./dtos/createUserDto";

export const handler: Handler = middyfy(
  async (
    event: APIGatewayEvent & CreateUser,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { email, favorites } = event.body;

    const { USERS_TABLE } = process.env;
    const repository = new UsersRepository(createDynamoDBClient(), USERS_TABLE);
    const createUserService = new CreateUserService(repository);

    try {
      const user = await createUserService.run({ email, favorites });

      return formatJSONResponse(201, user);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
