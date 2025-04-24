declare global {
  namespace Express {
    interface User extends Partial<User> {}
  }
}
