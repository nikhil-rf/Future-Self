// worker/src/models/User.js
// Minimal User model — worker only needs the user's name for emails.

import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name:  { type: String },
  email: { type: String },
  image: { type: String },
});

export default mongoose.models.User
  || mongoose.model('User', UserSchema);
