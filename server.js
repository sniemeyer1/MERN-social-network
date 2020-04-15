//bring in express
const express = require('express');

//bring in connectdb
const connectDB = require('./config/db.js');
//initialize app viable with express
const app = express();
//conecct db
connectDB();
//create single enpoint to test out
//take get request to /, callback is req, res, sends data to browser
app.get('/', (req, res) => res.send('API running'));
//listen on port via the variable PORT
//for heroku, OR default port locally
const PORT = process.env.PORT || 5000;
//pass in PORT and call back message that server is working
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
