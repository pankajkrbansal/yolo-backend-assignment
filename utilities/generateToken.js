const service = require("../services/service");
const jwt = require("jsonwebtoken");

const generateToken = async (req, res, userEmail) => {
  try {
    const token = jwt.sign({ userEmail }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    // Store the token in the session
    req.session.jwtToken = token;
    return;
    // return res.json("Logged In");
  } catch (err) {
    throw err;
  }
};

module.exports = generateToken;
