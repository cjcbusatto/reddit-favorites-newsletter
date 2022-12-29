import { User } from "../models/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class ListUsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async run(): Promise<Array<User>> {
    try {
      const users = await this.repository.findAll();
      return users;
    } catch (err) {
      return err;
    }
  }
}
