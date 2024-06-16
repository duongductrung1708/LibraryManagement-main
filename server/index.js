const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const {
  AuthRouter,
  BookRouter,
  AuthorRouter,
  BorrowalRouter,
  GenreRouter,
  UserRouter,
  ReviewRouter,
} = require("./routes");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require("./passport-config");
initializePassport(passport);

app.use("/api/auth", AuthRouter);
app.use("/api/book", BookRouter);
app.use("/api/author", AuthorRouter);
app.use("/api/borrowal", BorrowalRouter);
app.use("/api/genre", GenreRouter);
app.use("/api/user", UserRouter);
app.use("/api/review", ReviewRouter);

app.get("/", (req, res) => res.send("Welcome to Library Management System"));

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
