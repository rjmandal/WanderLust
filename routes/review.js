const express = require("express");

const router = express.Router();

const Listing = require("../models/Listing.js");

const Review = require("../models/Review.js");

const WrapAsync = require("../utils/WrapAsync.js");

const CustomError = require("../utils/CustomError.js");

const { reviewSchema } = require("../validateSchema.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new CustomError(404, errMsg);
  } else {
    next();
  }
};

//create route
router.post(
  "/listings/:id/reviews",
  validateReview,
  WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review created Sucessfully");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//delete route
router.delete(
  "/listings/:id/reviews/:reviewId",
  WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted Sucessfully");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
