const User = require('../models/user')
const Property = require('../models/property')

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProperties = await Property.countDocuments()
    
    const totalValueObj = await Property.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ])
    const totalValue = totalValueObj[0]?.total || 0

    const properties = await Property.find()
    const uniqueCities = [...new Set(properties.map(p => p.city).filter(Boolean))]

    res.status(200).json({
      totalUsers,
      totalProperties,
      totalValue,
      totalCities: uniqueCities.length
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt')
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['buyer', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Supported: buyer, owner, admin.' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.role = role
    await user.save()

    res.status(200).json({ message: 'User role updated successfully', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }

    await user.deleteOne()
    await Property.deleteMany({ owner: user._id })

    res.status(200).json({ message: 'User and their properties deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email')
      .sort('-createdAt')
    res.status(200).json(properties)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    await property.deleteOne()
    res.status(200).json({ message: 'Property deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProperties,
  deleteProperty,
}
