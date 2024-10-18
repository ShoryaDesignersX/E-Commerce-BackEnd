import multer from "multer";
import path from "path";

const productImageStorage = multer.diskStorage({
  // Destination to store image
  destination: "./public/Products",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const productImageUpload = multer({
  storage: productImageStorage,
  limits: {
    fileSize: 10000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, files, cb) {
    if (!files.originalname.trim().match(/\.(png|jpg|jpeg)$/i)) {

      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
    // console.log("uploaded",files)
  },
});

export { productImageUpload };
