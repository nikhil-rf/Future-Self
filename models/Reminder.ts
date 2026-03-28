import mongoose, { Schema, Document } from 'mongoose';

export type ReminderStatus = 'pending' | 'processing' | 'delivered' | 'archived' | 'failed';
export type ReminderImportance = 'High' | 'Medium' | 'Low';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  note: string;
  reminderDate: Date;
  importance: ReminderImportance;
  email: string;
  status: ReminderStatus;
  nudgeMessage?: string;
  createdAt: Date;
  deliveredAt?: Date;
  // Worker-managed fields
  processingAt?: Date;
  retryCount: number;
  lastError?: string;
}

const ReminderSchema = new Schema<IReminder>({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note:         { type: String, required: true, trim: true },
  reminderDate: { type: Date, required: true },
  importance:   { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  email:        { type: String, required: true },
  status:       { type: String, enum: ['pending', 'processing', 'delivered', 'archived', 'failed'], default: 'pending' },
  nudgeMessage: { type: String },
  createdAt:    { type: Date, default: Date.now },
  deliveredAt:  { type: Date },
  // Worker-managed fields
  processingAt: { type: Date },
  retryCount:   { type: Number, default: 0 },
  lastError:    { type: String },
});

export default mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
