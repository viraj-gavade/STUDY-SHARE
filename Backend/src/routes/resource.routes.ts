import express from 'express';
import { 
  createResource, 
  getAllResources, 
  getResourceById,
  upvoteResource,
  addComment,
  updateResource,
  deleteResource,
  getUserResources
} from '../controllers/resource.controller';
import { searchResources } from '../controllers/search.controller';
import { authMiddleware } from '../middlewares/auth';
import { uploadToS3, handleMulterError } from '../middlewares/s3Uploader';
import { resourceValidation, validateResource } from '../middlewares/resource.validation';

const router = express.Router();

/**
 * @route   POST /api/resources
 * @desc    Upload a new resource
 * @access  Private
 */
router.post(
  '/', 
  authMiddleware,
  // Debug middleware
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Request headers:', req.headers);
    console.log('Request body before file upload:', req.body);
    next();
  },
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    uploadToS3.single('file')(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      console.log('File uploaded successfully:', req.file);
      console.log('Request body after file upload:', req.body);
      next();
    });
  },
  resourceValidation,
  validateResource,
  createResource
);

/**
 * @route   GET /api/resources
 * @desc    Get all resources
 * @access  Public
 */
router.get('/', getAllResources);

/**
 * @route   GET /api/resources/search
 * @desc    Search resources with filters and pagination
 * @access  Public
 */
router.get('/search', searchResources);

/**
 * @route   GET /api/resources/user
 * @desc    Get all resources uploaded by the authenticated user
 * @access  Private
 */
router.get(
  '/user',
  authMiddleware,
  getUserResources
);

/**
 * @route   GET /api/resources/:id
 * @desc    Get a resource by ID
 * @access  Public
 */
router.get('/:id', getResourceById);

/**
 * @route   POST /api/resources/:id/upvote
 * @desc    Upvote a resource
 * @access  Private
 */
router.post(
  '/:id/upvote',
  authMiddleware,
  upvoteResource
);

/**
 * @route   POST /api/resources/:id/comment
 * @desc    Add a comment to a resource
 * @access  Private
 */
router.post(
  '/:id/comment',
  authMiddleware,
  addComment
);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a resource's metadata (not the file)
 * @access  Private (only owner or admin)
 */
router.put(
  '/:id',
  authMiddleware,
  resourceValidation,
  validateResource,
  updateResource
);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource
 * @access  Private (only owner or admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  deleteResource
);

export default router;

