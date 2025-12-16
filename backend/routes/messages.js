const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', auth, async (req, res) => {
  const { content } = req.body;
  const senderId = req.user.id;
  try {
    const message = new Message({ sender: senderId, content });
    await message.save();
    await message.populate('sender', 'username');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;