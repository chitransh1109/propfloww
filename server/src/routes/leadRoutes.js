const express = require('express')
const router = express.Router()
const { createLead, getMyLeads, deleteLead } = require('../controllers/leadController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createLead)
router.get('/', protect, getMyLeads)
router.delete('/:id', protect, deleteLead)

module.exports = router
