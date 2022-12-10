const { StatusCodes } = require('http-status-codes');

const {
  getAllUsers,
  getUser,
  updateUser,
  getTotalCount,
  isPasswordCorrect,
  updateUserPassword,
} = require('../../models/users/users.model');
const usersValidator = require('../../validators/users.validator');
const paginationValidator = require('../../validators/pagination.validator');
const { InvalidCredentials } = require('../../errors/index');

async function httpGetAllUsers(req, res) {
  const { search, sort } = req.query;
  usersValidator.validate({ sort });
  const { page, limit } = paginationValidator.getValidated({
    page: req.query.page,
    limit: req.query.limit,
  });

  const skip = (page - 1) * limit;

  const users = await getAllUsers(skip, limit, { search, sort });
  const usersCount = await getTotalCount({ search });

  res.status(StatusCodes.OK).json({
    data: { users },
    paging: {
      next: getNextPageUrl(req.baseUrl, usersCount, page, limit),
      previous: getPreviousPageUrl(req.baseUrl, usersCount, skip, limit),
      totalItems: usersCount,
      totalPages: Math.ceil(usersCount / limit),
      pageNumber: page,
      pageItems: users.length,
    },
  });
}

async function httpGetUser(req, res) {
  const { id } = req.params;
  const user = await getUser(id);
  res.status(StatusCodes.OK).json(user);
}

async function httpGetCurrentUser(req, res) {
  const { id } = req.user;
  const user = await getUser(id);
  res.status(StatusCodes.OK).json(user);
}

async function httpUpdateCurrentUser(req, res, next) {
  const { name } = req.body;
  const { id } = req.user;

  const updatedUser = await updateUser(id, name);
  res.locals.user = updatedUser;

  next();
}

function updateCurrentUserResponse(req, res) {
  const { user } = res.locals;
  delete res.locals.user;

  res.status(StatusCodes.OK).json(user);
}

async function httpUpdateCurrentUserPassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  usersValidator.validate({ password: oldPassword });
  usersValidator.validate({ password: newPassword });
  const { id } = req.user;

  const isOldPasswordCorrect = isPasswordCorrect(id, oldPassword);

  if (!isOldPasswordCorrect)
    throw new InvalidCredentials('Ivalid Credentials');

  await updateUserPassword(id, newPassword);

  res.status(StatusCodes.OK).json({ success: true });
}

function getNextPageUrl(baseUrl, totalCount, page, limit) {
  if (page * (limit + 1) >= totalCount) return '';

  return `${baseUrl}?page=${page + 1}&limit=${limit}`;
}

function getPreviousPageUrl(baseUrl, totalCount, page, limit) {
  if (page <= 0 || page * (limit + 1) >= totalCount) return '';

  return `${baseUrl}?page=${page - 1}&limit=${limit}`;
}

module.exports = {
  httpGetAllUsers,
  httpGetUser,
  httpGetCurrentUser,
  httpUpdateCurrentUser,
  httpUpdateCurrentUserPassword,
  updateCurrentUserResponse,
};
