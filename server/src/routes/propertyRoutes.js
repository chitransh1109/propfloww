const express = require('express')
const router = express.Router()

const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController')

const { protect, authorize } = require('../middleware/authMiddleware')

router.get('/', getProperties)
router.get('/my', protect, getMyProperties)
router.post('/', protect, authorize('owner', 'admin'), createProperty)
router.get('/:id', getPropertyById)
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty)
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty)

module.exports = router