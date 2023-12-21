const mongoose = require('mongoose')
const Post = require('./Post')

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{
   timestamps:true 
})

const User = mongoose.model('User', userSchema)

module.exports = User