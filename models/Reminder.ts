import mongoose, { Schema, Document } from 'mongoose';

export type ReminderStatus = 'pending' | 'delivered' | 'archived';
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
}

const ReminderSchema = new Schema<IReminder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true, trim: true },
  reminderDate: { type: Date, required: true },
  importance: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  email: { type: String, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'archived'], default: 'pending' },
  nudgeMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
});

export default mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
