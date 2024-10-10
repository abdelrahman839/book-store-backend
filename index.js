require("dotenv").config();
const express = require("express");
const server = express();
const port = process.env.PORT || 8000;
const connection = require("./src/config/db");
const cors = require("cors");
const routes = require("./src/routes/index");

connection();

server.use(express.json());
server.use(cors());
server.use('/api', routes)

const cluster = require("cluster");
const os = require("os");
const clusterWorkerSize = os.cpus().length

if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers equal to clusterWorkerSize
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.error(
        `Worker ${worker.process.pid} exited with code ${code} and signal ${signal}. Starting a new worker...`
      );
      cluster.fork(); // Automatically restart worker on exit
    });
  } else {
    // Worker processes run the server
    server.listen(port, () => {
      console.log(
        `Worker ${process.pid} is running and listening on port ${port}`
      );
    });
  }
} else {
  // Single process if no clustering
  server.listen(port, () => {
    console.log(
      `Server is listening on port ${port} with single worker ${process.pid}`
    );
  });
}
