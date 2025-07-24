// backend/models/Report.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reportSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  workDetails: {
    type: String,
    required: true,
    trim: true
  },
  inTime: {
    type: Date
  },
  outTime: {
    type: Date
  },
  duration: {
    type: Number // store in minutes
  }
}, {
  timestamps: true
});

export default model('Report', reportSchema);
