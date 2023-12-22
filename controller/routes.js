const express = require("express");
const router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();
const generateToken = require("../utilities/generateToken.js");
const protect = require("../utilities/validator.js");
const service = require('../services/service.js')
const singleDeviceLogin = require('../utilities/singleDeviceLoginCheck.js')

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
router.post("/login", singleDeviceLogin, async (req, res, next) => {
  try {
    // console.log("Request Data\n", req.body);
    let resp = await service.authUser(req.body);
    if (resp) {
      req.session.userEmail = req.body.email // storing email for single device login check
        // Store the session ID associated with the user's email in Redis
      // redisClient.set(userEmail, req.session.id);
      generateToken(req, res, resp.email);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', async(req, res,next) => {
    try{
        let postsArr = await service.getAllPosts();
        console.log(postsArr);
        if(postsArr) {
            res.json(postsArr)
        }
    }catch(err){
        next(err)
    }
})


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
router.get('/logout', (req, res) => {
  const userEmail = req.session.email;

  // Remove the session associated with the user's email from Redis on logout
  redisClient.del(userEmail);

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logged out successfully');
  });
});

module.exports = router;
