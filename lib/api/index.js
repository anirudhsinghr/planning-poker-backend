const { buildCreateRoom } = require("./usecase.factory");
const { randomId } = require("./id.generator");

const express = require("express");
const app = express();

app.post("/room", function (req, res) {
  const useCase = buildCreateRoom();
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json(useCase.execute({ roomId: randomId(), voterId: randomId(), connection: {} }));
});

module.exports = { app };