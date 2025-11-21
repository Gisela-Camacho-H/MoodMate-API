const express = require('express');
const router = express.Router();

const MoodEntry = require('../models/MoodEntry');
const protect = require('../middleware/auth'); 

router.post('/', protect, async (req, res) => {
  const { userId } = req.user; 
  const { emotion, note } = req.body;

  try {
    const newMoodEntry = new MoodEntry({
      userId,
      emotion,
      note,
    });

    const moodEntry = await newMoodEntry.save();
    
    res.status(201).json({ 
      msg: 'Mood entry successfully recorded.',
      entry: moodEntry 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error creating mood entry.');
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const moodEntries = await MoodEntry.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .select('-__v'); 

    res.json(moodEntries);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error retrieving mood entries.');
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    let moodEntry = await MoodEntry.findById(req.params.id);

    if (!moodEntry) {
      return res.status(404).json({ msg: 'Mood entry not found.' });
    }

    if (moodEntry.userId.toString() !== req.user.userId) {
      return res.status(401).json({ msg: 'User not authorized to delete this entry.' });
    }

    await MoodEntry.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Mood entry successfully removed.' });

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Mood entry not found.' });
    }
    res.status(500).send('Server Error deleting mood entry.');
  }
});

module.exports = router;
