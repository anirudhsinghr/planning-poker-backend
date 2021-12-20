const ExpressApiServer = require("./lib/api");

let server = null;


  server = new ExpressApiServer();
  server.start({ port: 3000, callback: () => console.log("Listening on port 3000  ") });