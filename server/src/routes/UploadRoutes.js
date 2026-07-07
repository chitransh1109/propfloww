// routes/uploadRoutes.js — Cloudinary permanent storage
const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const { protect } = require('../middleware/authMiddleware')

// ── Configure Cloudinary ──────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── Multer: store in memory (no disk touch) ───────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif)'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),   // ← RAM only, never touches disk
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
})

// ── Helper: stream buffer → Cloudinary ───────────────────
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || 'propflow', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })

// ── POST /api/upload ──────────────────────────────────────
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' })
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'propflow')
    // result.secure_url  →  permanent https://res.cloudinary.com/... URL
    res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      filename: result.public_id,
    })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ message: 'Image upload failed. Please try again.' })
  }
})

// ── Multer error handler ──────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 10MB.' })
    }
    return res.status(400).json({ message: err.message })
  }
  if (err) return res.status(400).json({ message: err.message })
  next()
})

module.exports = router