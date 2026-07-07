const Property = require('../models/property')

const getProperties = async (req, res) => {
  try {
    const { city, type, bhk, minPrice, maxPrice, listingType, status } = req.query

    const filter = {}

    if (city) filter.city = new RegExp(city, 'i')
    if (type) filter.type = type
    if (bhk) filter.bhk = Number(bhk)
    if (listingType) filter.listingType = listingType
    if (status) filter.status = status

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort('-createdAt')

    res.status(200).json(properties)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone'
    )

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.status(200).json(property)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      type,
      listingType,
      bhk,
      area,
      price,
      status,
      images,
      amenities,
      latitude,
      longitude,
    } = req.body

    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      address,
      city,
      type,
      listingType,
      bhk: Number(bhk) || 0,
      area: Number(area) || 0,
      price: Number(price),
      status: status || 'available',
      images: images || [],
      amenities: amenities || [],
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    })

    res.status(201).json(property)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')

      return res.status(400).json({ message })
    }

    res.status(500).json({ message: err.message })
  }
}

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your property' })
    }

    // Only allow these fields to be changed — never owner, _id, createdAt, etc.
    const allowedFields = [
      'title', 'description', 'address', 'city', 'type', 'listingType',
      'bhk', 'area', 'price', 'status', 'images', 'amenities', 'latitude', 'longitude',
    ]
    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(updated)
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

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your property' })
    }

    await property.deleteOne()

    res.status(200).json({ message: 'Property deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort(
      '-createdAt'
    )

    res.status(200).json(properties)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
}