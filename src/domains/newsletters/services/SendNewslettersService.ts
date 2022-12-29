import { GetActiveUsersService } from "../../users/services/GetActiveUsersService";

export class SendNewslettersService {
  constructor(private readonly getActiveUsersService: GetActiveUsersService) {}

  // TODO: add cache
  public async run() {
    const activeUsers = await this.getActiveUsersService.run();

    console.log(activeUsers);
    for (const activeUser of activeUsers) {
      for (const favorite of activeUser.favorites) {
        console.log(favorite);
      }
    }
  }
}
