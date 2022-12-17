import * as http from "http";
import App from "./src/App";
import logger from "./src/logger/api.logger";
import "reflect-metadata";

const port = process.env.PORT || 500;

App.set("port", port);
const server = http.createServer(App);

server.listen(port);

server.on("listening", function (): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr!.port}`;
  logger.info(`Listening on ${bind}`, null);
});

module.exports = App;
