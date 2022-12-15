const { StatusCodes } = require('http-status-codes');

function notFound (req, res) {
    res.status(StatusCodes.NOT_FOUND).json('Route not found');
}
module.exports = notFound;