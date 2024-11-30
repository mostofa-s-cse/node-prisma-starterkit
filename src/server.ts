import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";

// Check if the current process is the master process
if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);

    // Get the number of available CPU cores
    const numCPUs = os.cpus().length;

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for exit events to restart a worker if it dies
    cluster.on("exit", (worker, code, signal) => {
        console.error(`Worker ${worker.process.pid} died. Starting a new one...`);
        cluster.fork();
    });
} else {
    // Workers can share the same port
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started at ${SERVER_URL}:${PORT}`);
    });
}
