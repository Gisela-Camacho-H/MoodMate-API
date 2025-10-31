const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth'); 

/**
 * @swagger
 * /users/profile:
 *   post:
 *     summary: Crea o actualiza el perfil del usuario (CREATE/UPDATE)
 *     tags: [Users]
 *     security:
 *       - FirebaseIdToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gisela Camacho"
 *               email:
 *                 type: string
 *                 example: "test@moodmate.com"
 *               profileImageUrl:
 *                 type: string
 *                 example: "https://firebase.storage.url/photo.jpg"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente.
 *       200:
 *         description: Perfil actualizado exitosamente.
 *       401:
 *         description: Error de autenticación (Token inválido o faltante).
 *       500:
 *         description: Server Error.
 */
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

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado (READ)
 *     tags: [Users]
 *     security:
 *       - FirebaseIdToken: []
 *     responses:
 *       200:
 *         description: Perfil de usuario devuelto.
 *       401:
 *         description: Error de autenticación.
 *       404:
 *         description: Perfil no encontrado.
 *       500:
 *         description: Server Error.
 */
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
