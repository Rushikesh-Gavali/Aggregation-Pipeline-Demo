const mongoose = require("mongoose");

const url = 'mongodb://127.0.0.1:27017/AGGREGATION';

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to the Database...!');
  } catch (err) {
    console.log('Cannot connect to the database..!', err);
    process.exit();
  }
};

module.exports = connectDB;
