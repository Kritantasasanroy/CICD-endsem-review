const express = require('express');
const Message = require('../models/Message');
const Job = require('../models/Job');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all conversations (unique job-user pairs)
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('job', 'title')
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 });

    // Group by conversation (job + other user)
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.receiver 
        : msg.sender;
      
      const key = `${msg.job._id}-${otherUser._id}`;
      
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          job: msg.job,
          otherUser: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
      
      // Count unread messages
      if (msg.receiver._id.toString() === req.user._id.toString() && !msg.read) {
        conversationsMap.get(key).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations. Please try again.' });
  }
});

// Get messages for a specific job and user
router.get('/job/:jobId/user/:userId', authenticate, async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    // Verify user has access to this conversation
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check if current user is the employer who posted the job
    const isEmployer = job.postedBy.toString() === req.user._id.toString();
    
    // Check if current user is messaging about this job (either as sender or receiver)
    const isParticipant = userId === job.postedBy.toString() || req.user._id.toString() === job.postedBy.toString();
    
    // Allow access if user is the employer OR if they're messaging about this job
    if (!isEmployer && !isParticipant) {
      return res.status(403).json({ error: 'You do not have access to this conversation.' });
    }

    const messages = await Message.find({
      job: jobId,
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        job: jobId,
        sender: userId,
        receiver: req.user._id,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages. Please try again.' });
  }
});

// Send a message
router.post('/', authenticate, async (req, res) => {
  try {
    const { jobId, receiverId, message } = req.body;

    if (!jobId || !receiverId || !message) {
      return res.status(400).json({ error: 'Please provide job ID, receiver ID, and message.' });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Allow messaging if user is the employer OR if they're messaging the employer about this job
    const isEmployer = job.postedBy.toString() === req.user._id.toString();
    const isMessagingEmployer = receiverId === job.postedBy.toString();
    
    if (!isEmployer && !isMessagingEmployer) {
      return res.status(403).json({ error: 'You can only message the employer who posted this job.' });
    }

    const newMessage = new Message({
      job: jobId,
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim()
    });

    await newMessage.save();
    await newMessage.populate('sender', 'name email');
    await newMessage.populate('receiver', 'name email');

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Get unread message count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count.' });
  }
});

module.exports = router;
