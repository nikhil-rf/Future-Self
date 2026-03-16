const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  note: { type: String, required: true },
  reminderDate: { type: Date, required: true },
  importance: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  email: { type: String, required: true },
  userName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'delivered', 'archived'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date, default: null },
  nudgeMessage: { type: String, default: null }
});

// Avoid OverwriteModelError if hot-reloaded
module.exports = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
