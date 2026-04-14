const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[32m%s\x1b[0m`, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `Error connecting to MongoDB: ${error.message}`);
    
    if (error.message.includes('MongooseServerSelectionError') || error.message.includes('Could not connect to any servers')) {
      console.error(`\x1b[33m%s\x1b[0m`, `Tip: This often happens when your current IP address is not whitelisted in MongoDB Atlas.`);
      console.error(`\x1b[33m%s\x1b[0m`, `Check: https://www.mongodb.com/docs/atlas/security-whitelist/`);
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
