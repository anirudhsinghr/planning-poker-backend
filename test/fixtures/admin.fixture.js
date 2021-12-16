const Admin = require("../../lib/entities/admin");

function createAdmin({ adminId, roomId, connection, voterRepository }) {
  const admin = new Admin(adminId, roomId, connection);
  voterRepository.save(admin);
  return admin;
}

module.exports = { createAdmin };