import { AxiosInstance } from "axios";
import { Topic } from "../models/Topic";

export class GetTopTopicsBySubRedditService {
  private client: AxiosInstance;
  private numberOfTopics: number;

  constructor(client: AxiosInstance, numberOfTopics: number) {
    this.client = client;
    this.numberOfTopics = numberOfTopics;
  }

  public async run(subreddit: string): Promise<Array<Topic>> {
    const res = await this.client.get(
      `/r/${subreddit}/top/.json?count=${this.numberOfTopics}`
    );
    return res.data.data.children.map((item) => ({
      score: item.data.ups,
      title: item.data.title,
      link: item.data.permalink,
    }));
  }
}
