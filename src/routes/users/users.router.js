const express = require('express');
const router = express.Router();

const {
  httpGetAllUsers,
  httpGetUser,
  httpGetCurrentUser,
  httpUpdateCurrentUser,
  httpUpdateCurrentUserPassword,
  updateCurrentUserResponse,
} = require('./users.controller');
const {
  authenticateUser,
  authorizePermissions,
} = require('../../middlewares/authentication');
const { attachCookies } = require('../auth/auth.controller');


router.get(
  '/',
  authenticateUser,
  authorizePermissions(['admin']),
  httpGetAllUsers
);

router.get('/show-current', authenticateUser, httpGetCurrentUser);
router.patch(
  '/update-current',
  authenticateUser,
  httpUpdateCurrentUser,
  attachCookies,
  updateCurrentUserResponse
);

router.patch(
  '/update-current-password',
  authenticateUser,
  httpUpdateCurrentUserPassword
);

router.get(
  '/:id',
  authenticateUser,
  authorizePermissions(['admin']),
  httpGetUser
);

module.exports = router;
