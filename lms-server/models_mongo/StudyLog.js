import mongoose from "mongoose";

const StudyLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  lectureId: { type: String, required: true, index: true },
  courseId: { type: String, required: true },
  
  action: { 
    type: String, 
    enum: ['heartbeat', 'complete', 'skip', 'pause'], 
    default: 'heartbeat' 
  },
  
  position: Number, 
  duration: Number, 
  
  deviceInfo: { type: String, default: 'unknown' },
  
  timestamp: { type: Date, default: Date.now }
});

StudyLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model("StudyLog", StudyLogSchema);