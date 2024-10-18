import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userDataPath = "./Model/Users/user_data.json";

const SignUp = async (req, res) => {
  const userId = uuidv4();
  try {
    const { name, gender, mobile, email, password } = req.body;
    const mobileNumber = parseInt(mobile, 10);
    const user = {
      name,
      gender,
      mobile: mobileNumber,
      email,
      password,
      userId,
    };
    user.password = await bcrypt.hash(password, 10);
    if (req.file) {
      const imagePath = req.file.path.replace(/^public[\\/]/, "");
      user.imgPath = `http://localhost:3000/${imagePath}`; // Store the image path in the user object
    }
    // console.log(req.file);

    // Check if the file exists; if not, create it with an empty array
    if (!fs.existsSync(userDataPath)) {
      fs.writeFileSync(userDataPath, JSON.stringify([]));
    }

    const fileData = JSON.parse(fs.readFileSync(userDataPath));

    const emailExists = fileData.some(
      (existingUser) => existingUser.email === email
    );
    if (emailExists) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Failed to delete the image file:", err);
          }
        });
      }
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
        status: false,
      });
    }
    console.log("asd", user);
    fileData.push(user);
    const jsonData = JSON.stringify(fileData);
    const filePath = "./Model/Users/user_data.json";

    fs.writeFileSync(filePath, jsonData);
    // console.log("JSON data saved to file successfully.");
    res.status(201).json({
      message: "JSON data saved to file successfully.",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Occur: ${error}`,
      status: false,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = req.body;
    // Check if the file exists; if not, create it with an empty array

    const fileData = JSON.parse(fs.readFileSync(userDataPath));

    const userData = fileData.find((details) => details.email === email);
    // console.log(userData);
    if (!userData) {
      return res.status(400).json({
        message: "Email not found or wrong",
        status: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, userData.password);

    if (!isPassEqual) {
      return res.status(403).json({
        message: "Password is Wrong or empty",
        success: false,
      });
    }

    const jwt_token = jwt.sign(
      { id: userData.userId },
      process.env.jwt_secret,
      {
        expiresIn: "8h",
      }
    );

    res.status(200).json({
      message: "Login Succesfulyy",
      jwt_token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error Occur: ${error}`,
      status: false,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const fileData = JSON.parse(fs.readFileSync(userDataPath));

    const userData = fileData.find((details) => details.userId === id);
    if (!userData) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    res.status(200).json(userData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Cant Find this id" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const fileData = JSON.parse(fs.readFileSync(userDataPath));

    const userData = fileData.find((details) => details.userId === id);
    if (!userData) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    if (req.file) {
      const imagePath = req.file.path.replace(/^public[\\/]/, "");
      userData.imgPath = `http://localhost:3000/${imagePath}`; // Store the image path in the user object
    }

    console.log("sss", userData);
    const { name, gender, mobile, email } = req.body;
    // Check if the email is already used by another user
    // const emailExists = fileData.some(
    //   (existingUser) => existingUser.email === email
    // );

    // if (emailExists) {
    //   if (req.file) {
    //     fs.unlink(req.file.path, (err) => {
    //       if (err) {
    //         console.error("Failed to delete the image file:", err);
    //       }
    //     });
    //   }
    //   return res.status(400).json({
    //     message: "Email already exists. Please use a different email.",
    //     status: false,
    //   });
    // }
    userData.name = name || userData.name; // Update only if provided
    userData.gender = gender || userData.gender;
    userData.mobile = mobile || userData.mobile;
    userData.email = email || userData.email;
    const jsonData = JSON.stringify(fileData, null, 2);

    console.log("after", jsonData);
    fs.writeFile(userDataPath, jsonData, (err) => err && console.error(err));
    res.status(200).json({
      message: "User Data Updated Succesfully",
      success: true,
      data: userData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `error:${error}` });
  }
};

export { SignUp, Login, getUser, updateUser };
