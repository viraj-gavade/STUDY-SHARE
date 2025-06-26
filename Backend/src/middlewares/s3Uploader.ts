import { Request } from 'express';
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
];

// File filter to validate MIME types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_FILETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: PDF, DOCX, PPTX`));
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
      // Generate unique file name
      const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, `resources/${uniqueFilename}`);
    },
  }),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});