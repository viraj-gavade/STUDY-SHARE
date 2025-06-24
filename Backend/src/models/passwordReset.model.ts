import { Schema, model, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  resetCode: string;
  expiresAt: Date;
  used: boolean;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    resetCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding reset codes
PasswordResetSchema.index({ email: 1, resetCode: 1 });
// Index for cleaning up expired codes
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = model<IPasswordReset>('PasswordReset', PasswordResetSchema);

export default PasswordReset;
