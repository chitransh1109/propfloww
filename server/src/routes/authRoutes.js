const express = require('express')
const router = express.Router()

const {
  register,
  login,
  getProfile,
  toggleSaveProperty,
  switchRole,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/profile', protect, getProfile)

// frontend uses POST
router.post('/save/:id', protect, toggleSaveProperty)
router.put('/save/:id', protect, toggleSaveProperty)

// frontend uses POST
router.post('/switch-role', protect, switchRole)
router.put('/switch-role', protect, switchRole)

module.exports = router