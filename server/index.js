// Import required modules
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Import routers
const routes = require("./routes");

// Configure dotenv for environment variables in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setup express
const app = express();
const PORT = process.env.PORT || 8080;

// Use morgan for logging
app.use(logger("dev"));

// Set middleware to process form data
app.use(express.urlencoded({ extended: false }));

// Use CORS for Cross Origin Resource Sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Parse cookies used for session management
app.use(cookieParser(process.env.SESSION_SECRET));

// Parse JSON objects in request bodies
app.use(express.json());

// Set middleware to manage sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Use passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialise passport as authentication middleware
const initializePassport = require("./passport-config");
initializePassport(passport);

// Implement routes for REST API
app.use("/api/auth", routes.AuthRouter);
app.use("/api/book", routes.BookRouter);
app.use("/api/author", routes.AuthorRouter);
app.use("/api/borrowal", routes.BorrowalRouter);
app.use("/api/genre", routes.GenreRouter);
app.use("/api/user", routes.UserRouter);
app.use("/api/review", routes.ReviewRouter);

app.get("/", (req, res) => res.send("Welcome to Library Management System"));

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

connectDB();

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
