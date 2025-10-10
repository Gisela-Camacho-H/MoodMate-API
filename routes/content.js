const express = require('express');
const router = express.Router();

const moodmateContent = require('../data/moodmate_content.json');
const inspirationalQuotes = require('../data/inspirational_quotes.json');

/**
 * @swagger
 * /content/all:
 *   get:
 *     summary: Obtiene todo el contenido estático de la aplicación (emociones, frases inspiradoras)
 *     tags: [Content (Public)]
 *     security: []
 *     responses:
 *       200:
 *         description: Contenido estático devuelto exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 support_content:
 *                   type: object
 *                   description: Contenido de apoyo mapeado por emoción (frases y escrituras).
 *                 inspirational_quotes:
 *                   type: array
 *                   description: Lista de frases inspiradoras para la pantalla de inicio.
 *       500:
 *         description: Server Error.
 */
router.get('/all', async (req, res) => {
  try {
    const allContent = {
      support_content: moodmateContent.support_content,
      inspirational_quotes: inspirationalQuotes
    };
    res.json(allContent);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error retrieving static content.');
  }
});

/**
 * @swagger
 * /content/emotions/{emotionName}:
 *   get:
 *     summary: Obtiene el contenido de apoyo (escrituras/frases) para una emoción específica
 *     tags: [Content (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: emotionName
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la emoción (ej. Happy, Anxious)
 *     responses:
 *       200:
 *         description: Contenido de apoyo devuelto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scriptures:
 *                   type: array
 *                   description: Tres opciones de escrituras bíblicas.
 *                 quotes:
 *                   type: array
 *                   description: Tres opciones de frases motivacionales.
 *       404:
 *         description: Contenido no encontrado para la emoción especificada.
 *       500:
 *         description: Server Error.
 */
router.get('/emotions/:emotionName', async (req, res) => {
  try {
    const emotionName =
      req.params.emotionName.charAt(0).toUpperCase() +
      req.params.emotionName.slice(1);

    if (!moodmateContent.support_content.hasOwnProperty(emotionName)) {
      return res.status(404).json({ msg: `Content not found for emotion: ${emotionName}` });
    }

    res.json(moodmateContent.support_content[emotionName]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error retrieving emotion-specific content.');
  }
});

module.exports = router;
