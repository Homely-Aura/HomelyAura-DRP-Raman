import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Ensure the uploads folder exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g. employee-<userId>-1627382912731.jpg
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `employee-${req.user.id}-${timestamp}${ext}`);
  }
});

// Only accept image files up to 2 MB
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});
