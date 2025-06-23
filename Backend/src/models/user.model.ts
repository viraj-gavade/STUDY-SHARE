import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  department: string;
  semester: number;
  myUploads: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    myUploads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

// Method to compare password for login
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = model<IUser>('User', UserSchema);

export default User;
