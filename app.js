const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const ejsMate = require("ejs-mate");

const methodOverride = require("method-override");

const session = require("express-session");

const flash = require("connect-flash");

const passport = require("passport");

const LocalStrategy = require("passport-local");

const User = require("./models/User.js");

const app = express();

const listingRoute = require("./routes/listing.js");

const reviewRoute = require("./routes/review.js");

const userRoute = require("./routes/user.js");

const CustomError = require("./utils/CustomError.js");

//ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//connect to database
main()
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", listingRoute);
app.use("/", reviewRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
  next(new CustomError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
