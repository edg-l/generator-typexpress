#!/usr/bin/env node

import Debug from "debug";
import http from "http";
import app from "../app";

const debug = Debug("<%= props.name %>:server");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const svPort = parseInt(val, 10);

  if (isNaN(svPort)) {
    // named pipe
    return val;
  }

  if (svPort >= 0) {
    // port number
    return svPort;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      throw new Error(bind + " requires elevated privileges");
    case "EADDRINUSE":
      throw new Error(bind + " is already in use");
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}
