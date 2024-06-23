const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./models");
const createError = require("http-errors"); // Import http-errors

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

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.get("/", (req, res) => res.send("Welcome to Library Management System"));

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log("Server listening on port " + process.env.PORT);
  db.connectDB();
});
