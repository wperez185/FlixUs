const jwt = require('jsonwebtoken');
const { User } = require('../models/usersModels');
const jwtSecret = process.env.JWT_SECRET || 'some-random-secret-key';

/**
 * Function to generate JWT from a payload.
 * @param {Object} payload - Object used to sign and generate the JWT.
 * @returns {String} - The generated token.
 */
function generateToken(payload) {
  return jwt.sign(payload, jwtSecret);
}

/**
 * Function to validate a JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Function to execute next callback/middleware in the route handler
 * @return {undefined}
 */
function validateToken(req, res, next) {
  const token = req.get('Authorization');
  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch(err) {
    res.status(401).json({ msg: 'Invalid token!' });
  }
}

module.exports = { generateToken, validateToken };