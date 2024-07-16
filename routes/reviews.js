const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utilit/warpAsync.js");
const {
  isAuthenticated,
  isAuther,
  reviewValidate,
} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

//add review router
router.post(
  "/",
  isAuthenticated,
  reviewValidate,
  warpAsync(reviewController.addReviews)
);

//delete review router
router.delete(
  "/:reviewId",
  isAuthenticated,
  isAuther,
  warpAsync(reviewController.destroyReview)
);

module.exports = router;
