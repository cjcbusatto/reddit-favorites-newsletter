import { User } from "../models/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class UpdateUserService {
  constructor(private readonly repository: UsersRepository) {}

  public async run({ id, active, favorites }: Partial<User>): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return this.repository.update(id, { active, favorites });
  }
}
