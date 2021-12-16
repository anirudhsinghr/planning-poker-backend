const Admin = require("../../lib/entities/admin");
const StubConnection = require("../stubs/stub-connection");

function createAdmin({ adminId, roomId, voterRepository }) {
  const admin = new Admin(adminId, roomId, new StubConnection());
  voterRepository.save(admin);
  return admin;
}

function createAdminForRoom({ adminId, room, voterRepository }) {
  const admin = createAdmin({adminId, roomId: room.id, voterRepository});
  room.addVoter(admin);
  return admin;
}

module.exports = { createAdmin, createAdminForRoom };