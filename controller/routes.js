const express = require("express");
const router = express.Router();
const redis = require("redis");
const generateToken = require("../utilities/generateToken.js");
const protect = require("../utilities/validator.js");
const service = require("../services/service.js");
const singleDeviceLogin = require("../utilities/singleDeviceLoginCheck.js");
const redisClient = redis.createClient();
/**
 * Route: POST /
 * Description: Register a new user
 * Access: Public
 */

router.post("/register", async (req, res, next) => {
  try {
    let resp = await service.registerUser(req.body);
    // generateToken(res, resp.email);
    res.json(resp);
  } catch (err) {
    next(err);
  }
});

/**
 * Route: POST /login
 * Description: Login a user
 * Access: Public
 */
// Example usage in your code
router.post("/login", singleDeviceLogin, async (req, res, next) => {
  try {
    let resp = await service.authUser(req.body);
    if (resp) {
      await redisClient.connect().catch(console.error);
      req.session.email = req.body.email;
      // Store the session ID associated with the user's email in Redis
      await redisClient.set(req.body.email, req.session.id);
      generateToken(req, res, resp.email);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let postsArr = await service.getAllPosts();
    console.log(postsArr);
    if (postsArr) {
      res.json(postsArr);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/create", protect, async (req, res, next) => {
  // router.post("/create", protect, async (req, res, next) => {
  try {
    let postBody = req.body;

    postBody.email = req.user.email;

    let resp = await service.createPost(postBody);
    if (resp) {
      res.json(resp);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/edit", protect, async (req, res, next) => {
  try {
    let postBody = req.body;

    let resp = await service.updatePost(postBody);
    if (resp) {
      res.json("Post Updated Successfully");
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/delete-post", protect, async (req, res, next) => {
  try {
    let postBody = req.body;

    let resp = await service.deletePost(postBody);
    if (resp) {
      res.json("Post Deleted Successfully");
    }
  } catch (err) {
    next(err);
  }
});

// Logout route to remove session from Redis
router.get("/logout", async (req, res) => {
  try {
    const userEmail = req.session.email;

    // Remove the session associated with the user's email from Redis on logout
    await new Promise((resolve, reject) => {
      redisClient.del(userEmail, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("Error logging out");
      } else {
        res.send("Logged out successfully");
      }
    });
  } catch (error) {
    res.status(500).send("Error logging out");
  }
});

module.exports = router;
