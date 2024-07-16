const Listing = require("./models/listing");
const Review = require("./models/review");
const CusttomError = require("./utilit/customError.js");
const { validateListingSchema, reviewSchema } = require("./schema.js");

module.exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in.");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.currentUser._id.equals(listing.owner)) {
    req.flash("error", "You are not the owner of this listing !");
    res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};

module.exports.isAuther = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let reviewOwner = await Review.findById(reviewId);
  if (!res.locals.currentUser._id.equals(reviewOwner.auther)) {
    req.flash("error", "You are not the owner of this review !");
    res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};

//listing validate middleware fn
module.exports.validateSchema = (req, res, next) => {
  let { error } = validateListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    next(new CusttomError(400, errMsg));
  } else {
    next();
  }
};

//review validate middleware fn
module.exports.reviewValidate = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    next(new CusttomError(400, errMsg));
  } else {
    next();
  }
};
