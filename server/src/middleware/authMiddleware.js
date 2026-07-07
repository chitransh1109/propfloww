const jwt = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) return res.status(401).json({ message: 'User not found' })

    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// used by Socket.io (no async, no DB hit — just decodes the JWT)
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized' })
  }

  next()
}

module.exports = { protect, authorize, verifyToken }