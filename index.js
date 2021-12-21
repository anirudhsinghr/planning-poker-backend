const ExpressApiServer = require("./lib/api");

let server = null;


  server = new ExpressApiServer();
  const port = process.env.PORT || 3000;
  server.start({ port: port, callback: () => console.log(`Listening on port ${port}`) });