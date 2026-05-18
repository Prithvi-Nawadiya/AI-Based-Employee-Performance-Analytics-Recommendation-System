// routes/aiRoutes.js - AI recommendation routes
const express = require('express');
const router = express.Router();
const {
  generateRecommendation,
  rankEmployees,
  getTrainingSuggestions,
  getDepartmentAnalysis
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT protection to all AI routes
router.use(protect);

// POST /api/ai/recommend         - AI recommendation for single employee
router.post('/recommend', generateRecommendation);

// POST /api/ai/rank              - AI ranking for all employees
router.post('/rank', rankEmployees);

// POST /api/ai/training          - AI training suggestions
router.post('/training', getTrainingSuggestions);

// POST /api/ai/department-analysis - AI department-level analysis
router.post('/department-analysis', getDepartmentAnalysis);

module.exports = router;
