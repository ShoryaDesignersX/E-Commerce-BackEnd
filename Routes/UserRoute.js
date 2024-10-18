import express from "express";
import {
  getUser,
  Login,
  SignUp,
  updateUser,
} from "../Controller/UserController.js";
import {
  loginVaidation,
  signupValidation,
} from "../Middleware/UserValidations.js";
import { ensureAuth } from "../Middleware/AuthToken.js";
import { imageUpload } from "../Controller/ImageController.js";

const router = express.Router();

router.post("/signup", imageUpload.single("image"), signupValidation, SignUp);
router.post("/login", loginVaidation, Login);

// get
router.get("/dashboard/:id", ensureAuth, getUser);
// update
router.put("/updateuser/:id", imageUpload.single("image"), updateUser);


export { router };
