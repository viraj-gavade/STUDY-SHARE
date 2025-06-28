import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client, BUCKET_NAME } from '../config/aws';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define allowed file types
const ALLOWED_FILETYPES = [
  'application/pdf', // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'application/msword', // DOC (legacy)
  'application/vnd.ms-powerpoint', // PPT (legacy)
  'application/vnd.ms-excel', // XLS (legacy)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'image/jpeg', // JPG/JPEG
  'image/png', // PNG
];

// File filter to validate MIME types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_FILETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: PDF, DOCX, PPTX, XLSX, XLS, JPG, PNG`));
  }
};

// Configure multer-s3 uploader
export const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: BUCKET_NAME,
    acl: 'public-read', // Make files publicly accessible
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content-type header
    key: (req: Request, file: Express.Multer.File, cb) => {
      // Generate unique file name using UUID to avoid collisions
      const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      // Store in a folder structure: resources/[department]/[filename]
      const department = req.body.department ? 
        req.body.department.toLowerCase().replace(/\s+/g, '-') : 'general';
      cb(null, `resources/${department}/${uniqueFilename}`);
    },
    metadata: (req, file, cb) => {
      // Store original filename as metadata
      cb(null, { originalName: file.originalname });
    }
  }),
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Limit file size to 15MB
  },
});

// Error handling middleware for multer
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum file size is 200MB.' 
      });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ message: err.message });
  }
  // No error
  next();
};