// src/modules/reviews/reviews.routes.js
const { Router } = require('express');
const { createReview, listReviews } = require('./reviews.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();

router.get('/',  listReviews);
router.post('/', authMiddleware, createReview);

module.exports = router;
