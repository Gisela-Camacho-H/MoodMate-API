const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth'); 

router.post('/profile', async (req, res) => {
  const { userId } = req.user; 
  const { name, email, profileImageUrl, birthday } = req.body;

  const profileFields = {
    userId,
    name,
    email,
    profileImageUrl,
    birthday,
  };

  try {
    let user = await User.findOne({ userId: userId });

    if (user) {
      user = await User.findOneAndUpdate(
        { userId: userId },
        { $set: profileFields },
        { new: true }
      );
      return res.json({ msg: 'User profile updated successfully.', user });
    }

    user = new User(profileFields);
    await user.save();
    
    res.status(201).json({ msg: 'User profile created successfully.', user });

  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email is already in use by another account.' });
    }
    res.status(500).send('Server Error during profile creation/update.');
  }
});


router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-__v');

    if (!user) {
      return res.status(404).json({ msg: 'User profile not found. Please create one.' });
    }

    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error retrieving user profile.');
  }
});

module.exports = router;
