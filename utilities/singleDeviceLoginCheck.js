const redis = require('redis');
const redisClient = redis.createClient();

// Middleware to check single-device login
async function singleDeviceLogin(req, res, next) {
    const userEmail = req.session.email;
  
    if (userEmail) {
      redisClient.get(userEmail, (err, reply) => {
        if (err) {
          return res.status(500).send('Error checking session');
        }
  
        if (reply && reply !== req.session.id) {
          return res.status(403).send('User already logged in from another device');
        } else {
          // Store the session ID associated with the user's email in Redis
          redisClient.set(userEmail, req.session.id);
          next();
        }
      });
    } else {
      next();
    }
  }

module.exports = singleDeviceLogin