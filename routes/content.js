const express = require('express');
const router = express.Router();

const moodmateContent = require('../data/moodmate_content.json');
const inspirationalQuotes = require('../data/inspirational_quotes.json');
const moodmate_description = require('../data/moodmate_description.json');

/**
 * @swagger
 * /content/all:
 *   get:
 *     summary: Get all the static content (Emotions)
 *     tags: [Content (Public)]
 *     security: []
 *     responses:
 *       200:
 *         description: Static content get successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 support_content:
 *                   type: object
 *                   description: Content mapped by emotion (phrases and scriptures).
 *       500:
 *         description: Server Error.
 */
router.get('/all', async (req, res) => {
    try {
        const allContent = {
            support_content: moodmateContent.support_content
        };
        res.json(allContent);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error retrieving static content.');
  }
});

/**
 * @swagger
 * /content/quotes:
 *   get:
 *     summary: Get all inspirational_quotes
 *     tags: [Content (Public)]
 *     security: []
 *     responses:
 *       200:
 *         description: inspirational_quotes get successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inspirational_quotes:
 *                   type: array
 *                   description: list of inspirational quotes for the home page.
 *       500:
 *         description: Server Error.
 */
router.get('/quotes', async (req, res) => {
    try {
        const quotes = {
            inspirational_quotes: inspirationalQuotes 
        };
        res.json(quotes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error retrieving static content.');
  }
});

/**
 * @swagger
 * /content/description:
 *   get:
 *     summary: Get all the static description (Emotions)
 *     tags: [Content (Public)]
 *     security: []
 *     responses:
 *       200:
 *         description: Static content description get successfully 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description_content:
 *                   type: object
 *                   description: Content mapped by emotion description
 *       500:
 *         description: Server Error.
 */
router.get('/description', async (req, res) => {
    try {
        const description = {
            description_content: moodmate_description.description_content
        };
        res.json(description);
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
