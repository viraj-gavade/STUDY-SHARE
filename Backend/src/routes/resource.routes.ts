import express from 'express';
import { 
  createResource, 
  getAllResources, 
  getResourceById,
  upvoteResource,
  addComment
} from '../controllers/resource.controller';
import { authMiddleware } from '../middlewares/auth';
import { uploadToS3 } from '../middlewares/s3Uploader';

const router = express.Router();

/**
 * @route   POST /api/resources
 * @desc    Upload a new resource
 * @access  Private
 */
router.post(
  '/', 
  authMiddleware, 
  uploadToS3.single('file'), 
  createResource
);

/**
 * @route   GET /api/resources
 * @desc    Get all resources
 * @access  Public
 */
router.get('/', getAllResources);

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

export default router;

