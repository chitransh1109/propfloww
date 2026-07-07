require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- Collection "${coll.name}" has ${count} documents`);
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(coll.name).findOne();
        console.log(`  Sample:`, JSON.stringify(sample).slice(0, 300));
      }
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
