const { UnauthorizedError } = require('../errors');

function checkPermissions (requestUser, resourceUserId) {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId.toString() === resourceUserId.toString()) return;
  throw new UnauthorizedError("User don't have permission");
}

module.exports = checkPermissions;