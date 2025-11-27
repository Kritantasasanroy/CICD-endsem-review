const express = require('express');
const Job = require('../models/Job');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', authenticate, async (req, res) => {
  try {
    let jobs;
    
    if (req.user.role === 'job_seeker') {
      // Freelancers see all open jobs
      jobs = await Job.find().populate('postedBy', 'name email').populate('assignedTo', 'name email');
    } else {
      // Employers see only their own jobs
      jobs = await Job.find({ postedBy: req.user._id }).populate('postedBy', 'name email').populate('assignedTo', 'name email');
    }
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs. Please try again later.' });
  }
});

// Get single job
router.get('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy').populate('assignedTo');
    if (!job) {
      return res.status(404).json({ error: 'Job not found. It may have been deleted.' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job details. Please check the job ID and try again.' });
  }
});

// Create job (worker_seeker only)
router.post('/', authenticate, authorize('worker_seeker'), async (req, res) => {
  try {
    const { title, description, budget, skills } = req.body;
    
    if (!title || !description || !budget) {
      return res.status(400).json({ error: 'Please provide title, description, and budget for the job.' });
    }
    
    const job = new Job({
      ...req.body,
      postedBy: req.user._id
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job. Please check all required fields and try again.' });
  }
});

// Update job
router.put('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found. It may have been deleted.' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update jobs that you posted.' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job. Please try again.' });
  }
});

// Delete job
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found. It may have already been deleted.' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete jobs that you posted.' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job. Please try again.' });
  }
});

module.exports = router;
