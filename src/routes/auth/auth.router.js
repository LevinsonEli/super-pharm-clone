const express = require('express');
const router = express.Router();

const {
  httpLogin,
  httpRegister,
  httpLogout,
  attachCookies,
  registerResponse,
  loginResponse,
} = require('./auth.controller');

router.post('/register', httpRegister, attachCookies, registerResponse);
router.post('/login', httpLogin, attachCookies, loginResponse);
router.get('/logout', httpLogout);

module.exports = router;