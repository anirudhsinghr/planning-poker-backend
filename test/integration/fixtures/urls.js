const BASE_API_URL = "http://localhost:3000";
module.exports = {
  createRoomUrl: () => `${BASE_API_URL}/room`,
  connectToRoomUrl: ({ roomId }) => `${BASE_API_URL}/room/${roomId}`
}