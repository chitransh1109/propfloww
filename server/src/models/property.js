const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },

    type: {
      type: String,
      enum: ['apartment', 'villa', 'plot'],
      required: [true, 'Property type is required'],
    },

    listingType: {
      type: String,
      enum: ['rent', 'sale'],
      required: [true, 'Listing type is required'],
    },

    bhk: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
    },

    status: {
      type: String,
      enum: ['available', 'rented', 'sold'],
      default: 'available',
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Property', propertySchema)