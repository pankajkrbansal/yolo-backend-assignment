const express = require('express')
const router = require('./controller/routes')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
const session = require('express-session');

dotenv.config()
const app = express()

const KEY = process.env.JWT_SECRET_KEY

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(cookieParser());
app.use(session({
    secret: KEY,
    resave: false,
    saveUninitialized: false,
  }));

app.use('/api', router)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server Running @ ${process.env.PORT}`);
}, )