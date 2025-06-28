import { Schema, model, Document, Types } from 'mongoose';

// Comment interface
export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IResource extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  subject: string;
  department: string;
  semester: number;
  teacher?: string;
  tags?: string[];
  fileUrl: string;
  fileType: string;
  uploadedBy: Types.ObjectId;
  upvotes: number;
  upvotedBy: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment schema
const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    teacher: {
      type: String,
    },
    tags: [String],
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [CommentSchema],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const Resource = model<IResource>('Resource', ResourceSchema);

export default Resource;
