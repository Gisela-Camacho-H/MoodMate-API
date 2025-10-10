const express = require('express');
const router = express.Router();

const MoodEntry = require('../models/MoodEntry');
const protect = require('../middleware/auth'); 

/**
 * @swagger
 * /moods:
 *   post:
 *     summary: Crea un nuevo registro de ánimo (CREATE)
 *     tags: [Moods]
 *     security:
 *       - FirebaseIdToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emotion
 *             properties:
 *               emotion:
 *                 type: string
 *                 example: "Happy"
 *               note:
 *                 type: string
 *                 example: "Great day at work and finished the API routes."
 *     responses:
 *       201:
 *         description: Registro de ánimo creado exitosamente.
 *       401:
 *         description: Error de autenticación (Token inválido o faltante).
 *       500:
 *         description: Server Error.
 */
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

/**
 * @swagger
 * /moods:
 *   get:
 *     summary: Obtiene todos los registros de ánimo del usuario (READ ALL)
 *     tags: [Moods]
 *     security:
 *       - FirebaseIdToken: []
 *     responses:
 *       200:
 *         description: Lista de registros de ánimo devuelta, ordenada por fecha.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   emotion:
 *                     type: string
 *                   note:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Error de autenticación.
 *       500:
 *         description: Server Error.
 */
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

/**
 * @swagger
 * /moods/{id}:
 *   delete:
 *     summary: Elimina un registro de ánimo por su ID (DELETE)
 *     tags: [Moods]
 *     security:
 *       - FirebaseIdToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del registro de ánimo a eliminar (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Registro de ánimo eliminado exitosamente.
 *       401:
 *         description: Usuario no autorizado para eliminar esta entrada.
 *       404:
 *         description: Registro no encontrado.
 *       500:
 *         description: Server Error.
 */
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
