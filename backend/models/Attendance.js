// backend/models/Attendance.js

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const attendanceSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_first', 'half_second', 'leave'],
    required: true
  },
  leaveType: {
    type: String,
    enum: ['sick', 'casual', 'other'],
    default: null
  }
}, { timestamps: true });

export default model('Attendance', attendanceSchema);
