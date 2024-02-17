const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const ejsMate = require("ejs-mate");

const methodOverride = require("method-override");

const app = express();

const listingRoute = require("./routes/listing.js");

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

app.use("/", listingRoute);

app.all("*", (req, res, next) => {
  next(new CustomError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
