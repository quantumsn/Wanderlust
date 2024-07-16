const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReviews = async (req, res, next) => {
  let { id } = req.params;
  let newReview = new Review(req.body.review);
  newReview.auther = req.user._id;
  await newReview.save();
  let listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "New review succesfully added.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  let deleteReview = await Review.findByIdAndDelete(reviewId);
  console.log(deleteReview);
  req.flash("success", `Review is deleted`);
  res.redirect(`/listings/${id}`);
};
