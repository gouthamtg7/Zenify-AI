const express = require('express');
const multer = require('multer');
const { processAudio } = require('../controllers/aiControllers');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/talktozen', upload.single('audio'), processAudio);

module.exports = router;
