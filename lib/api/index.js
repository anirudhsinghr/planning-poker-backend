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
  const connection = new SSEConnection(request, response);
  // request.on("close", function() { buildLeaveRoom().execute({ roomId: id, voterId: voterId }) });

});

module.exports = { app };