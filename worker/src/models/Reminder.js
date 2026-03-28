// worker/src/models/Reminder.js
// Mongoose model mirroring the Next.js app schema.
// retryCount and processingAt are worker-owned fields for idempotency.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReminderSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note:          { type: String, required: true, trim: true },
  reminderDate:  { type: Date, required: true },
  importance:    { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  email:         { type: String, required: true },

  // Status lifecycle:  pending → processing → delivered | failed
  status:        { type: String, enum: ['pending', 'processing', 'delivered', 'archived', 'failed'], default: 'pending' },

  nudgeMessage:  { type: String },
  createdAt:     { type: Date, default: Date.now },
  deliveredAt:   { type: Date },

  // Worker-managed fields
  processingAt:  { type: Date },   // when we started processing (idempotency lock)
  retryCount:    { type: Number, default: 0 },
  lastError:     { type: String },
});

// Guard against model re-compilation (hot reload in dev)
export default mongoose.models.Reminder
  || mongoose.model('Reminder', ReminderSchema);
