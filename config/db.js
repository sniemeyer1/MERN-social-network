//bring in mongoose to connect
const mongoose = require('mongoose');
//grabs string from mongodb
const config = require('config');
//to get mongodb uri value from json file
const db = config.get('mongoURI');
//to connect to mongodb, gives back a promise, async await
// create a function, an async arrow funtion, put inside try catch block
// pass in error message if something goes wrong
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
