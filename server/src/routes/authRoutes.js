const express = require('express')
const router = express.Router()

const {
  register,
  login,
  getProfile,
  toggleSaveProperty,
  switchRole,
  forgotPassword,
  resetPassword,
  updateProfileImage,
  deleteAccount,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/profile', protect, getProfile)
router.put('/profile-image', protect, updateProfileImage)
router.delete('/delete-account', protect, deleteAccount)

// password resets
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// frontend uses POST
router.post('/save/:id', protect, toggleSaveProperty)
router.put('/save/:id', protect, toggleSaveProperty)

// frontend uses POST
router.post('/switch-role', protect, switchRole)
router.put('/switch-role', protect, switchRole)

module.exports = router