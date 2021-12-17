const axios = require("axios").default;
const { createRoomUrl } = require("./urls");

async function createRoom() {
  const response = await axios.post(createRoomUrl());
  return response.data;
}

module.exports = { createRoom };