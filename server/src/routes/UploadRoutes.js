// backend/routes/uploadRoutes.js
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect } = require('../middleware/authMiddleware')

// ── Create uploads directory if it doesn't exist ──
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// ── Multer config: store on disk, validate type & size ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, unique + path.extname(file.originalname).toLowerCase())
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
})

// ── POST /upload — single image ──
// Returns { url: '/uploads/<filename>' }
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' })
  }

  // Build the public URL for the uploaded file
  // e.g. https://yourdomain.com/uploads/1234567890-123456789.jpg
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

  res.status(201).json({ url, filename: req.file.filename })
})

// ── Error handler for multer errors ──
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 10MB.' })
    }
    return res.status(400).json({ message: err.message })
  }
  if (err) {
    return res.status(400).json({ message: err.message })
  }
  next()
})

module.exports = router