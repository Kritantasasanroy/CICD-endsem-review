const express = require('express');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all proposals
router.get('/', authenticate, async (req, res) => {
  try {
    let proposals;
    
    if (req.user.role === 'job_seeker') {
      // Freelancers see only their own proposals
      proposals = await Proposal.find({ freelancer: req.user._id })
        .populate('job')
        .populate('freelancer', 'name email');
    } else {
      // Employers see proposals for their jobs only
      const userJobs = await Job.find({ postedBy: req.user._id }).select('_id');
      const jobIds = userJobs.map(job => job._id);
      
      proposals = await Proposal.find({ job: { $in: jobIds } })
        .populate('job')
        .populate('freelancer', 'name email');
    }
    
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals. Please try again later.' });
  }
});

// Create proposal (job_seeker only)
router.post('/', authenticate, authorize('job_seeker'), async (req, res) => {
  try {
    const { job, coverLetter, proposedBudget } = req.body;
    
    if (!job || !coverLetter || !proposedBudget) {
      return res.status(400).json({ error: 'Please provide job ID, cover letter, and proposed budget.' });
    }
    
    // Check if job exists
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ error: 'Job not found. It may have been deleted.' });
    }
    
    // Check if already submitted proposal
    const existingProposal = await Proposal.findOne({ job, freelancer: req.user._id });
    if (existingProposal) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this job.' });
    }
    
    const proposal = new Proposal({
      ...req.body,
      freelancer: req.user._id
    });
    await proposal.save();
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit proposal. Please try again.' });
  }
});

// Update proposal status (worker_seeker only)
router.put('/:id', authenticate, authorize('worker_seeker'), async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found. It may have been deleted.' });
    }

    if (proposal.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update proposals for jobs that you posted.' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ error: `This proposal has already been ${proposal.status}.` });
    }

    proposal.status = req.body.status;
    await proposal.save();

    if (req.body.status === 'accepted') {
      await Job.findByIdAndUpdate(proposal.job._id, {
        assignedTo: proposal.freelancer,
        status: 'in_progress'
      });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update proposal status. Please try again.' });
  }
});

// Delete proposal
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found. It may have already been deleted.' });
    }

    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own proposals.' });
    }

    if (proposal.status === 'accepted') {
      return res.status(400).json({ error: 'Cannot delete an accepted proposal. Please contact the employer.' });
    }

    await proposal.deleteOne();
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete proposal. Please try again.' });
  }
});

module.exports = router;
