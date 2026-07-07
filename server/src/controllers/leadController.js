const Lead = require('../models/lead')
const Property = require('../models/property')

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body

    if (!propertyId || !name || !email || !phone) {
      return res.status(400).json({ message: 'Please fill all required fields.' })
    }

    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' })
    }

    // A user cannot submit a lead enquiry on their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot submit an enquiry on your own property.' })
    }

    const lead = await Lead.create({
      property: propertyId,
      owner: property.owner,
      buyer: req.user._id,
      name,
      email,
      phone,
      message,
    })

    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get leads for owner properties
// @route   GET /api/leads
// @access  Private
const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ owner: req.user._id })
      .populate('property', 'title city price listingType')
      .sort('-createdAt')

    res.status(200).json(leads)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      return res.status(404).json({ message: 'Enquiry not found.' })
    }

    // Only the property owner can delete their received leads
    if (lead.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this enquiry.' })
    }

    await lead.deleteOne()

    res.status(200).json({ message: 'Enquiry deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createLead,
  getMyLeads,
  deleteLead,
}
