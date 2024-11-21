import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dir = "./uploads"; // Directory to save uploaded files
        try {
            // Check if the directory exists
            await fs.access(dir);
        } catch (err) {
            // Create directory if it doesn't exist
            await fs.mkdir(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const fileExtension = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        cb(null, filename);
    },
});

// Initialize Multer
export const upload = multer({ storage });
