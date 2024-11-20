import { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: "error", // Only log errors
    format: format.combine(
        format.timestamp(),
        format.json() // Log messages in JSON format
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: "error.log" }) // Log to a file
    ],
});

export default logger;
