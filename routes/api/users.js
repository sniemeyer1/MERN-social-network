//bring in express
const express = require('express');
//to use express router, use variable
const router = express.Router();
//@route    GET api/users
//@desc     test route (what does this route do?)
//@access   Public (if token is needed to access route)
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
