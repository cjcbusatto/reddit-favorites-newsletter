import { User } from "../models/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class DeleteUserService {
  constructor(private readonly repository: UsersRepository) {}

  public async run(id: string): Promise<User> {
    try {
      const user = await this.repository.findById(id);
      if (!user) {
        return;
      }

      await this.repository.delete(id);
      return user;
    } catch (err) {
      return err;
    }
  }
}
