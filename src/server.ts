import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";

app.listen(PORT, () => {
    console.log(`Server running at ${SERVER_URL}:${PORT}`);
});
