import { User } from "../models/User";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class UsersRepository {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  public async findAll() {
    try {
      const res = await this.docClient
        .scan({
          TableName: this.tableName,
        })
        .promise();

      return res.Items as Array<User>;
    } catch (err) {
      return err;
    }
  }

  public async findById(id: string): Promise<User> {
    try {
      const res = await this.docClient
        .get({
          TableName: this.tableName,
          Key: { id },
        })
        .promise();

      return res.Item as User;
    } catch (err) {
      throw err;
    }
  }

  public async create(user: User): Promise<User> {
    try {
      await this.docClient
        .put({
          TableName: this.tableName,
          Item: user,
        })
        .promise();
    } catch (err) {
      throw err;
    }
    return user;
  }

  public async update(
    id: string,
    { favorites, active }: Partial<User>
  ): Promise<User> {
    const updateExpression = ["updatedAt = :updatedAt"];
    const expressionAttributeValues = {
      ":id": id,
      ":updatedAt": new Date().toISOString(),
    };

    if (favorites) {
      updateExpression.push("favorites = :favorites");
      expressionAttributeValues[":favorites"] = favorites;
    }

    console.log("favorites", favorites);
    console.log("active", active);
    if (active !== undefined) {
      updateExpression.push("active = :active");
      expressionAttributeValues[":active"] = active;
    }

    console.log(updateExpression);
    console.log(expressionAttributeValues);

    const updated = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: "set " + updateExpression.join(","),
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updated.Attributes as User;
  }

  public async delete(id: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }

  public async getActiveUsers(): Promise<Array<User>> {
    const res = await this.docClient
      .scan({
        TableName: this.tableName,
        FilterExpression: "active = :active",
        ExpressionAttributeValues: {
          ":active": true,
        },
      })
      .promise();

    return res.Items as Array<User>;
  }
}
