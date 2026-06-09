import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  party: {
    type: String,
    required: [true, 'Party is required'],
    unique: true
  },
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    unique: true
  },
  votes: [
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }
  ],
  voteCount: {
    type: Number,
    default: 0
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;