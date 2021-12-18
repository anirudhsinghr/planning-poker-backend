const axios = require("axios").default;
const ExpressApiServer = require("../../lib/api");
const expect = require("chai").expect;

let app = null;

beforeEach(function () {
  app = new ExpressApiServer();
  app.start();
});

it("Creates a room", async function () {
  const response = await axios.post("http://localhost:3000/room");
  
  expect(response.status).to.equal(201);
  expect(response.data.roomId).to.not.be.undefined;
  expect(response.data.roomId.length).to.not.equal(0);
});

afterEach(function () {
  app.stop();
});