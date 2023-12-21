const express = require("express");
const router = express.Router();
const generateToken = require("../utilities/generateToken.js");
const protect = require("../utilities/validator.js");
const service = require('../services/service.js')

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
router.post("/login", async (req, res, next) => {
  try {
    // console.log("Request Data\n", req.body);
    let resp = await service.authUser(req.body);
    if (resp) {
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

module.exports = router;
