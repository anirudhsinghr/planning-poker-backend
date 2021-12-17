const { buildCreateRoom, buildJoinRoom } = require("./usecase.factory");
const { randomId } = require("./id.generator");

const express = require("express");
const { SSEConnection } = require("./sse");
const app = express();

app.post("/room", function (request, response) {
  const useCase = buildCreateRoom();
  response.setHeader('Content-Type', 'application/json');
  response.status(201).json(useCase.execute({ roomId: randomId() }));
});

app.get("/room/:id", function (request, response) {
  const { id } = request.params;
  const connection = new SSEConnection(response);
  // request.on("close", function() { buildLeaveRoom().execute({ roomId: id, voterId: voterId }) });
  const useCase = buildJoinRoom();
  const result = useCase.execute({ roomId: randomId(), voterId: randomId(), connection });
});

let server = null;
const start = () => server = app.listen(3000);
const stop = () => server.close();

module.exports = { start, stop };