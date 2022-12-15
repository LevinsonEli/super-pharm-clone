const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { BadRequestError, CustomAPIError } = require('../../errors/index.js');

async function imageUpload(req, res) {
  if (!req.files || !req.files.image || !req.files.image.tempFilePath)
    throw new BadRequestError('Image must be provided');
  const imagePath = req.files.image.tempFilePath;

  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_FOLDER_NAME,
    });

    res.status(StatusCodes.OK).json({ url: result.secure_url });
  } catch (err) {
    console.log(err);
    throw new CustomAPIError('Failed to upload image');
  } finally {
    fs.unlinkSync(imagePath);
  }
}

module.exports = {
  imageUpload,
};
