const redis = require("redis");
const redisClient = redis.createClient();

// Middleware to check single-device login
async function singleDeviceLogin(req, res, next) {
  const userEmail = req.session.email;
  await redisClient.connect().catch(console.error);
  
  if (userEmail) {
    let emailFound = await redisClient.get(userEmail);
    if (emailFound) {
      return res.status(403).send("User already logged in from another device");
    }
  } else {
    next();
  }
  next()
}

module.exports = singleDeviceLogin;
