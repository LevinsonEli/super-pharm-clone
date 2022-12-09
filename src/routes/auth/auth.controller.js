const { StatusCodes } = require('http-status-codes');

const {
  register,
  isExist,
  getUserByEmail,
} = require('../../models/users/users.model');
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  InvalidCredentials,
} = require('../../errors');
const usersValidator = require('../../validators/products.validator');
const { createJWT } = require('../../utils');

const httpRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  usersValidator.validate({ name, email, password });

  const isUserExist = await isExist(email);
  if (isUserExist)
    throw new BadRequestError('User already exist');

  const createdUser = await register(name, email, password);

  res.locals.user = createdUser;
  next();
};

function registerResponse(req, res) {
  const { user } = res.locals;
  delete res.locals.user;
  
  res.status(StatusCodes.CREATED).json(user);
}

const httpLogin = async (req, res, next) => {
  const { email, password } = req.body;
  usersValidator.validate({ email });

  const user = await getUserByEmail(email);
  if (!user) 
    throw new BadRequestError('User not found');
  
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword)
    throw new InvalidCredentials('Invalid credentials');

  res.locals.user = user;
  next();
};

function loginResponse(req, res) {
  const { user } = res.locals;
  delete res.locals.user;

  res.status(StatusCodes.OK).json(user);
}

const httpLogout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ success: true });
};

function attachCookies(req, res, next) {
  const { user } = res.locals;

  const tokenData = {
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  };
  const token = createJWT(tokenData);

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 86400000),
    secure: process.env.NODE_ENV === 'PROD',
    signed: true,
  });
  next();
}

module.exports = {
  httpRegister,
  httpLogin,
  httpLogout,
  attachCookies,
  registerResponse,
  loginResponse,
};