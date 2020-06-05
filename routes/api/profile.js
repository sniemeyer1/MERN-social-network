//bring in express
const express = require('express');
//to use express router, use variable
const router = express.Router();
//bring in auth middleware
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//bring in models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    GET api/profile/me
//@desc     get current users profile
//@access   Private

//added auth as a second parameter since that route is protected
//use async await because using mongoose which returns a promise
//use try catch for errors
//findOne bc only finding one user
//find by user, user pertains to Profile model user field which will be object id of user
//set that to user id which comes in with the token
//populate (method) with name and avatar in User model

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    POST api/profile
//@desc     create or update user profile
//@access   Private
//post request that takes in data, use express validator
//the only 2 required fields are status and skills
//uses express validator
//check for body errors
//pull everything out from body
//build profile object
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    //initialize to empty object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //build social object
    //initialize first or social will be undefined
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    // to update and insert data
    // take profile model and find one by the user - user field is object id and can match that
    // mongoose method must use await in front because it returns a promise
    //look for profile by user, send back profile

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      //return profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/profile
//@desc     get all profiles
//@access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    GET api/profile/user/user_id
//@desc     get profile by user ID
//@access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//export router
module.exports = router;
