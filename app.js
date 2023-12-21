const express = require("express");
const router = require("./controller/routes");
const dotenv = require("dotenv");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const rateLimit = require("express-rate-limit");
const myInterceptor = require('./utilities/interceptor')

dotenv.config();
const app = express();

const KEY = process.env.JWT_SECRET_KEY;

// Initialize client.
// let redisClient = createClient();

// redisClient.connect().catch(console.error);

// // Initialize store.
// let redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "myapp:",
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: KEY,
    resave: false,
    saveUninitialized: false,
    // store: redisStore
  })
);

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Apply interceptor globally to intercept all incoming requests
app.use(myInterceptor);

app.use("/api", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running @ ${process.env.PORT}`);
});
