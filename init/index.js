const mongoose = require("mongoose");

const initData = require("./Data.js");

const Listing = require("../models/Listing.js");

//connect to database
main()
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
