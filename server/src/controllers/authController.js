const User = require('../models/user')
const generateToken = require('../utils/generateToken')


const register = async (req, res) => {
  try {
    const { name, password, role } = req.body
    const email = req.body.email?.toLowerCase().trim()

    // Verify if user already exists
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer',
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { password } = req.body
    const email = req.body.email?.toLowerCase().trim()

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedProperties')

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const toggleSaveProperty = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const propId = req.params.id

    const exists = user.savedProperties.some(
      id => id.toString() === propId.toString()
    )

    if (exists) {
      user.savedProperties = user.savedProperties.filter(
        id => id.toString() !== propId.toString()
      )
    } else {
      user.savedProperties.push(propId)
    }

    await user.save()

    res.json({ savedProperties: user.savedProperties })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot switch roles.' })
    }

    user.role = user.role === 'owner' ? 'buyer' : 'owner'
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  register,
  login,
  getProfile,
  toggleSaveProperty,
  switchRole,
}