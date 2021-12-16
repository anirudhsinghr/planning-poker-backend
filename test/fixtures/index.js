const AdminFixture = require("./admin.fixture");
const RoomFixture = require("./room.fixture");
const VoterFixture = require("./voter.fixture");

module.exports = { ...AdminFixture, ...RoomFixture, ...VoterFixture };