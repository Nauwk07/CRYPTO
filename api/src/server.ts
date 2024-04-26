const { Server } = require("socket.io");
import * as dotenv from "dotenv";
import http from "http";
import app from "./app";
dotenv.config();

// normalize the port, return a valid port number
const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.API_PORT ?? "8080");
app.set("port", port);

const errorHandler = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (
    error.code // list of error.code possible: https://nodejs.org/api/errors.html#errors_common_system_errors
  ) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    case "ECONNREFUSED":
      console.error(bind + " connection is refused.");
      process.exit(1);
    case "ECONNRESET":
      console.error(bind + " connection as been reset by a peer.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app); // create the server

const io = new Server(server);

io.on("connection", (socket: any) => {
  initSocketEvents(socket, io);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// listeners
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("🌐 Server running on " + bind);
});

import "@db/mongodb";
import { initSocketEvents } from "@utils/socket.events";
(async () => {
  try {
    server.listen(port);
  } catch (error) {
    console.error(error);
  }
})();

export default server;
