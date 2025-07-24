// backend/models/Task.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  subAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

// Auto-delete tasks 24 hrs after their `date`
taskSchema.index({ date: 1 }, { expireAfterSeconds: 86400 });

export default model('Task', taskSchema);
