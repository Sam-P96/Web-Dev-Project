import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDirectory = path.join(process.cwd(), 'uploads', 'cars');

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;