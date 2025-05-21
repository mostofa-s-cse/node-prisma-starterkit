import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Function to create multer configuration with dynamic folder
const createMulterConfig = (folderName: string) => {
  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure storage
  const storage = multer.diskStorage({
    destination: (_: Request, __: Express.Multer.File, cb) => {
      cb(null, uploadDir);
    },
    filename: (_: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${folderName}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  // File filter
  const fileFilter = (_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  };

  // Configure multer
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
};

// Create specific upload instances
export const profileUpload = createMulterConfig('profiles');
export const projectUpload = createMulterConfig('projects');
export const documentUpload = createMulterConfig('documents');

// Default export for backward compatibility
export default createMulterConfig('profiles'); 