import express from 'express';
import Candidate from '../models/candidate.js';
import User from '../models/user.js';
import { jwtAuthMiddleware } from '../jwt.js';

const router = express.Router();

const isadmin = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user && user.role === 'admin';
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
};

// POST /candidates - create a new candidate
router.post('/', jwtAuthMiddleware, async (req, res, next) => {
  try {
    if (!req.user || !await isadmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const data = req.body;
    const candidate = new Candidate(req.body);
    const savedCandidate = await candidate.save();
    console.log('Candidate created:', savedCandidate);

    res.status(201).json(savedCandidate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res, next) => {
  try {
    if (!req.user || !await isadmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const candidateId = req.params.candidateID;
    const updatedCandidateData = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true,
        runValidators: true
      }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (err) {
    next(err);
  }
});

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res, next) => {
  try {
    if (!req.user || !await isadmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    const candidateId = req.params.candidateID;
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/:candidateID/vote', jwtAuthMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const candidateId = req.params.candidateID;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isVoted) {
      return res.status(400).json({ error: 'User has already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if(user.role === 'admin') {
      return res.status(403).json({ error: 'Admins cannot vote' });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount += 1;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: 'Vote cast successfully' });
  }
   catch (err) {
    next(err);
  }
});

router.get('/vote/count', async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });
    const records = await candidates.map(candidate => ({
      party: candidate.party,
      symbol: candidate.symbol,
      voteCount: candidate.voteCount
    }));

    const voteCountResult = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          totalVotes: { $sum: '$voteCount' }
        }
      }
    ]);

    const totalVotes = voteCountResult.length ? voteCountResult[0].totalVotes : 0;

    res.status(200).json({ totalVotes, records });
  } catch (err) {
    next(err);
  }
});

export default router;
