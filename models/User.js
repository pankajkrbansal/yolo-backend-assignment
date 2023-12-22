const mongoose = require('mongoose')
const Post = require('./Post')

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
   timestamps:true 
})

const User = mongoose.model('User', userSchema)

module.exports = User