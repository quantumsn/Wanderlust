const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.index = async (req, res) => {
  let listingData = await Listing.find({});
  res.render("listings/index.ejs", { listingData, c: 12 });
};

module.exports.filters = async (req, res) => {
  let { c } = req.query;
  let listingData = await Listing.find({ categories: c });
  res.render("listings/index.ejs", { listingData, c });
};

module.exports.searchListings = async (req, res) => {
  let { q } = req.query;
  q = q.toLowerCase().trim();
  let listingData = await Listing.find({ country: q });
  res.render("listings/index.ejs", { listingData, c: 12 });
};

module.exports.listingForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.addListing = async (req, res, next) => {
  let coordinates = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.url;
  let filename = req.file.filename;
  let data = new Listing(req.body.listing);
  data.owner = req.user._id;
  data.image = { url, filename };
  data.geometry = coordinates.body.features[0].geometry;
  await data.save();
  let id = data._id;
  req.flash("success", "New listing succesfully added.");
  res.redirect(`/listings/${id}`);
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for dose not exist !!");
    res.redirect("/listings");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listingData = await Listing.findByIdAndUpdate(
    id,
    {
      ...req.body.listing,
    },
    { runValidators: true }
  );
  let coordinates = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  listingData.geometry = coordinates.body.features[0].geometry;
  await listingData.save();
  if (req.file) {
    let url = req.file.url;
    let filename = req.file.filename;
    listingData.image = { url, filename };
    await listingData.save();
  }
  req.flash("success", "listing succesfully edited.");
  res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "auther" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for dose not exist !!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", `"${deleteListing.title}", listing is deleted`);
  res.redirect("/listings");
};
