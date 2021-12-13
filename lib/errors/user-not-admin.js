class UserNotAdminError extends Error {
  constructor() {
    super("User is not an admin");
    this.name = "UserNotAdminError";
  }
}

module.exports = UserNotAdminError;