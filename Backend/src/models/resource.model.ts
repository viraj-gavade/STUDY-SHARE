import { Schema, model, Document, Types } from 'mongoose';

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
  uploadedBy: Types.ObjectId;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const Resource = model<IResource>('Resource', ResourceSchema);

export default Resource;
