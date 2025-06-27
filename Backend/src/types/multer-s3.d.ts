
import { Request } from 'express';
import { S3Client } from '@aws-sdk/client-s3';

declare global {
  namespace Express {
    namespace MulterS3 {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        bucket: string;
        key: string;
        acl: string;
        contentType: string;
        contentDisposition: string | null;
        storageClass: string;
        serverSideEncryption: string | null;
        metadata: { [key: string]: string } | null;
        location: string;
        etag: string;
        versionId?: string;
      }
    }

    interface Request {
      file?: MulterS3.File;
      files?: {
        [fieldname: string]: MulterS3.File[];
      } | MulterS3.File[];
    }
  }
}
