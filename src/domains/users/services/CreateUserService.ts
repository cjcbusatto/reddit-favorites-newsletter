import { User } from "../models/User";
import * as uuid from "uuid";
import { UsersRepository } from "../repositories/UsersRepository";

export class CreateUserService {
  constructor(private readonly repository: UsersRepository) {}

  public async run({ email, favorites }: Partial<User>): Promise<User> {
    const now = new Date().toISOString();

    const newUser = await this.repository.create({
      id: uuid.v4(),
      email,
      favorites,
      createdAt: now,
      updatedAt: now,
      active: true,
    });
    return newUser;
  }
}
