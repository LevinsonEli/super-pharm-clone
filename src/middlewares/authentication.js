const { InvalidCredentials, UnauthorizedError } = require('../errors');
const { getTokenPayload } = require('../utils/jwt');

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) 
    throw new InvalidCredentials('Authentication required');

console.log(token);
  const payload = getTokenPayload(token);
  req.user = payload.user;
console.log(req.user);
  next();
};

const authorizePermissions = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            throw new UnauthorizedError('User dont have permission');

        next();
    };
};

module.exports = { authenticateUser, authorizePermissions };
