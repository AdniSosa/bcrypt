// Este middleware manejará la generación del token y verificación.
const session = require('express-session'),
jwt = require('jsonwebtoken'),
password = require('../crypto/config');

function tokenGenerator(user) {
    return jwt.sign({ user: user.id }, password.hashedSecret, {
      expiresIn: '1h',
    });
  }
  
  //middleware
  function verifyToken(req, res, next) {
    const token = req.session.token;
  
    if (!token) {
      res.status(401).json({ Mensaje: 'Token no existe' });
    }
    jwt.verify(token, password.hashedSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ Mensaje: 'Token invalido' });
      }
      req.user = decoded.user;
      next();
    });
  }

  module.exports = {
    tokenGenerator, 
    verifyToken
};