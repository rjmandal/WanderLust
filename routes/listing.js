const express = require("express");

const router = express.Router();

const Listing = require("../models/Listing.js");

const WrapAsync = require("../utils/WrapAsync.js");

const CustomError = require("../utils/CustomError.js");

const { listingSchema } = require("../validateSchema.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new CustomError(404, errMsg);
  } else {
    next();
  }
};

//new route
router.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create route
router.post(
  "/listings",
  validateListing,
  WrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing created Sucessfully");
    res.redirect("/listings");
  })
);

//show all route
router.get(
  "/listings",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//show route
router.get(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you are trying to access, does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//edit route
router.get(
  "/listings/:id/edit",
  WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing you are trying to access, does not exists");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/listings/:id",
  validateListing,
  WrapAsync(async (req, res, next) => {
    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
    req.flash("success", "Listing Updated Sucessfully");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//delete route
router.delete(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted Sucessfully");
    res.redirect("/listings");
  })
);

module.exports = router;
