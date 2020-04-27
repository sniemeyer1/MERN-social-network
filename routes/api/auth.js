//this route is used to
//bring in express
const express = require('express');
//to use express router, use variable
const router = express.Router();
//bring in middleware
const auth = require('../../middleware/auth');
//bring in bcrypt
const bcrypt = require('bcryptjs');
//bring in json web token to use token to authenticate and access protected routes
const jwt = require('jsonwebtoken');
//bring in config for token variable
const config = require('config');
//bring in to help with validation
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
//@route    GET api/auth
//@desc     test route (what does this route do?)
//@access   Public (if token is needed to access route)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST api/auth
//@desc     authenticate user and get token to make request to private routes
//@access   Public
router.post(
  '/',
  [
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  //async await
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure
    const { email, password } = req.body;
    //create user,
    try {
      let user = await User.findOne({ email });

      //see if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      //make sure password matches- bcrypt can compare encrypted
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      //create payload, an object with a user that has an id, give promise, get id
      const payload = {
        user: {
          id: user.id,
        },
      };
      //sign token, pass in payload, pass in secret, inside callback get back error or get back token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//exports router
module.exports = router;
