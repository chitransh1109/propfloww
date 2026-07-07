require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./src/models/property');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties`);
    properties.forEach((p, idx) => {
      console.log(`\nProperty ${idx + 1}: ${p.title} (${p._id})`);
      console.log(`Images type: ${typeof p.images}, value:`, p.images);
    });
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
