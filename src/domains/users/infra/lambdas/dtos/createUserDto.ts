export interface CreateUser {
  body: {
    email: string
    favorites: Array<string>
  }
}
