class InvalidArgumentError extends Error {
  constructor() {
    super("Given arguments are invalid");
    this.name = "InvalidArgumentError";
  }
}

module.exports = InvalidArgumentError;