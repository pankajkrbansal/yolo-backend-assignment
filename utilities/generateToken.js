const service = require("../services/service");
const jwt = require("jsonwebtoken");

const generateToken = async (req, res, userEmail) => {
  const token = jwt.sign({ userEmail }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  // Store the token in the session
  req.session.jwtToken = token;

  return res.json("Logged In");
};

module.exports = generateToken;
