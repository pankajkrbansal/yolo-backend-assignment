const bcrypt = require("bcrypt");
const connection = require("../utilities/connection");

const service = {}

/**
 * Registers a new user.
 * @param {Object} usrBody - User data (name, email, password).
 * @returns {Promise<Object>} - Resolves to the registered user data.
 * @throws {Error} - If the user is already registered or if the email is invalid.
 */
service.registerUser = async (usrBody) => {
  let regex = /^[a-z]+[0-9]*\@gmail.com$/;
  let { userName, email, password } = usrBody;
  let userCollection = await connection.getUserCollection();
  let userData = await userCollection.find({ email });
  if (userData.length > 0) {
    let err = new Error("User Already Registered");
    err.status = 400;
    throw err;
  }
  if (!regex.test(email)) {
    let err = new Error("Invalid Email, Gmail Domain Expected xyz@gmail.com");
    err.status = 401;
    throw err;
  } else {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(usrBody.password, salt); // hashing password
    usrBody.password = password;

    
    console.log(usrBody);

    let resp = await userCollection.create(usrBody); // saving user data to to user collection

    if (resp) {
      return resp;
    } else {
      throw new Error("Invalid User Data");
    }
  }
};

service.authUser = async (userData) => {
  let { email } = userData;

  let userModel = await connection.getUserCollection();
  let user = await userModel.findOne({ email });
  // console.log(`user 36 ${user} ${userData.password}`);

  let decrypted = await bcrypt.compare(userData.password, user.password);
  // console.log(decrypted);

  if (user && decrypted) {
    console.log(user);
    return user;
  } else {
    let e = new Error("Invalid Credentials");
    e.status = 401;
    throw e;
  }
};

service.getAllPosts = async () => {
  try {
    let postCollection = await connection.getPostCollection();
    let posts = await postCollection.find();
    return posts;
  } catch (err) {
    throw err;
  }
};

/**
 * Creates a new post.
 * @param {Object} noteData - Post data.
 * @returns {Promise<Object>} - Resolves to the created post data.
 * @throws {Error} - If the user is not found.
 */
service.createPost = async (noteData) => {
  let postCollection = await connection.getPostCollection();
  let resp = await postCollection.create(noteData);
  // console.log("\nressponse\n", resp);
  if (resp) {
    return resp;
  } else {
    let err = new Error("User Not Found");
    err.status = 404;
    throw err;
  }
};

service.updatePost = async (post) => {
  console.log("Edit post = ", post._id);
  let postCollection = await connection.getPostCollection();
  let resp = await postCollection.updateOne(
    { _id: post._id },
    { $set: { ...post } }
  );
  console.log("Edit Resp = ", resp);
  if (resp.modifiedCount == 1) {
    return true;
  } else {
    let err = new Error("User Not Found");
    err.status = 404;
    throw err;
  }
};

service.deletePost = async(post) => {
    try{
        let postCollection = await connection.getPostCollection()
        let resp = await postCollection.deleteOne({_id:post._id})
        if(resp.deletedCount == 1){
            return true
        }
    }catch(err){
        throw err;
    }
}

module.exports = service