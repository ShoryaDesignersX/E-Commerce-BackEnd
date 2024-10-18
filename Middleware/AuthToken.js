import jwt from "jsonwebtoken";
import fs from "fs";
const userDataPath = "./Model/Users/user_data.json";

const ensureAuth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      message: "Unauthorized! token is required",
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.jwt_secret);
    req.user = decoded;

    const fileData = JSON.parse(fs.readFileSync(userDataPath));

    const userData = fileData.find((details) => details.userId === decoded.id);

    if (userData) {
      next();
    } else {
      res.status(404).json({
        message: "User is not found with this token",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `error: ${error}`,
      success: false,
    });
  }
};

export { ensureAuth };
