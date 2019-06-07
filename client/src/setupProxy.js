const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/api", "/socket.io"], {
      target: "http://172.23.4.188:5001",
      // target: "http://localhost:5000",
      headers: { Connection: "keep-alive" }
    })
  );
};
