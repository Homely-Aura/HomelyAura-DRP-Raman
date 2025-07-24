import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  // ← New field: which Sub-Admin this employee is assigned to
  subAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export default model('Employee', employeeSchema);
