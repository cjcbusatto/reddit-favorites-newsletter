import { UsersRepository } from "../repositories/UsersRepository";

export class GetActiveUsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async run() {
    return this.repository.getActiveUsers();
  }
}
