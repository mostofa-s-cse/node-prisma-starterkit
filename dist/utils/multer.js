"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentUpload = exports.projectUpload = exports.profileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createMulterConfig = (folderName) => {
    const uploadDir = path_1.default.join(process.cwd(), 'uploads', folderName);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: (_, __, cb) => {
            cb(null, uploadDir);
        },
        filename: (_, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${folderName}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
        }
    });
    const fileFilter = (_, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    };
    return (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
};
exports.profileUpload = createMulterConfig('profiles');
exports.projectUpload = createMulterConfig('projects');
exports.documentUpload = createMulterConfig('documents');
exports.default = createMulterConfig('profiles');
//# sourceMappingURL=multer.js.map