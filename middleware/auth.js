//bring in jsonwebtoken
const jwt = require('jsonwebtoken');
//bring in config because we will need the secret
const config = require('config');
//export this middleware function
//has access to the request and response objects
//next is a callback that we have to run so that it moves on to the next piece of middleware
module.exports = function (req, res, next) {
  //get token from the header, when we send request to protected route the token needs to be sent thru header
  //the header key to send the token in
  const token = req.header('x-auth-token');
  //check if no token
  //401 means not authorized
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  //verify token, decode token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //take the req object and assign value to user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
