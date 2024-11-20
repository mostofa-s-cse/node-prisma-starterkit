import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import errorLogger from "./middlewares/errorLogger";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define a root route
app.get("/", (req, res) => {
    res.send("Welcome to the Node.js MVC Server!");
});

// Use the aggregated routes
app.use("/", routes);

// Use the error logger middleware
app.use(errorLogger);

// Use the error handler middleware
app.use(errorHandler);

export default app;
