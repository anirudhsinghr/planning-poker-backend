class VoterNotFoundError extends Error {
  constructor() {
    super("No voter found with given id");
    this.name = "VoterNotFoundError";
  }
}

module.exports = VoterNotFoundError;