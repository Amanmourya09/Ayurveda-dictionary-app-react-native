const express = require('express');
const router = express.Router();
const langCtrl = require('../controller/langCtrl');

// GET /api/lang?q=word → Search/filter by Sanskrit word (पद)


router.get('/get', langCtrl.getLang);

router.get('/word', langCtrl.getLangByWord);

// POST /api/lang → Add new Sanskrit words (single or multiple)
router.post('/post', langCtrl.postLang);

// PUT /api/lang/:id → Update a specific dictionary entry by ID
router.put('/:id', langCtrl.updateLang);

module.exports = router;
