const express = require('express')
const router = express.Router()

const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProperties,
  deleteProperty,
} = require('../controllers/adminController')

const { protect, authorize } = require('../middleware/authMiddleware')

// Protect all admin routes with auth checks
router.use(protect)
router.use(authorize('admin'))

router.get('/stats', getAdminStats)
router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/properties', getAllProperties)
router.delete('/properties/:id', deleteProperty)

module.exports = router
