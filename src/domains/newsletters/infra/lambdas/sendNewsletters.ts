import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { middyfy } from "../../../../core/lambda";
import { SendNewslettersService } from "../../services/SendNewslettersService";
import createDynamoDBClient from "../../../users/infra/database/db";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { GetActiveUsersService } from "../../../users/services/GetActiveUsersService";

export const handler: Handler = middyfy(
  async (
    _event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { USERS_TABLE } = process.env;
    const sendNewslettersService = new SendNewslettersService(
      new GetActiveUsersService(
        new UsersRepository(createDynamoDBClient(), USERS_TABLE)
      )
    );
    const data = await sendNewslettersService.run();
    console.log(data);
    return formatJSONResponse(200, {});
  }
);
