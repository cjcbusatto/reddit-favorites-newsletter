import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import { formatJSONResponse } from "../../../../core/api-gateway";
import { middyfy } from "../../../../core/lambda";
import { GetTop10BySubRedditService } from "../../services/GetTop10BySubRedditService";
import { api } from "../clients/api";

export const handler: Handler = middyfy(
  async (
    event: APIGatewayEvent & { pathParameters: { id: string } },
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { subreddit } = event.pathParameters;

    const getTop10SubredditService = new GetTop10BySubRedditService(api, 5);

    try {
      const data = await getTop10SubredditService.run(subreddit);

      return formatJSONResponse(200, data);
    } catch (err) {
      return formatJSONResponse(400, err);
    }
  }
);
