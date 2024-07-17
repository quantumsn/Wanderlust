const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const multer = require("multer");
const CusttomError = require("./utilit/customError");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const saveFile = async (req, res, next) => {
  try {
    await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "image",
        folder: "wanderlust_DEV",
      },
      (err, result) => {
        // console.log(result);
        (req.file.url = result.url),
          (req.file.filename = result.asset_folder + "/" + result.display_name);
      }
    );
    next();
  } catch (err) {
    fs.unlinkSync(req.file.path);
    next(err);
  }
};

module.exports = {
  saveFile,
  storage,
};
