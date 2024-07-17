const express = require("express");
const router = express.Router();
const warpAsync = require("../utilit/warpAsync.js");
const {
  isAuthenticated,
  isOwner,
  validateSchema,
} = require("../middlewares.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage, saveFile } = require("../cloudConfig.js");
const upload = multer({ storage });

//category filter route
router.get("/category", warpAsync(listingControllers.filters));

//search listings by country name
router.get("/search", warpAsync(listingControllers.searchListings));

router
  .route("/")
  .get(warpAsync(listingControllers.index))
  .post(
    isAuthenticated,
    upload.single("listing[image]"),
    saveFile,
    validateSchema,
    warpAsync(listingControllers.addListing)
  );

//add listing form router
router.get("/new", isAuthenticated, warpAsync(listingControllers.listingForm));

//edit router form
router.get(
  "/:id/edit",
  isAuthenticated,
  isOwner,
  warpAsync(listingControllers.editForm)
);

router
  .route("/:id")
  .put(
    upload.single("listing[image]"),
    saveFile,
    validateSchema,
    isAuthenticated,
    isOwner,
    warpAsync(listingControllers.editListing)
  )
  .get(warpAsync(listingControllers.showListing))
  .delete(
    isAuthenticated,
    isOwner,
    warpAsync(listingControllers.destroyListing)
  );

module.exports = router;
