const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
    lowercase: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  categories: [
    {
      type: String,
      enum: [
        "trending",
        "igloo",
        "mountains",
        "iconic cities",
        "rooms",
        "tents",
        "arctic",
        "farms",
        "boates",
        "castles",
        "beaches",
      ],
      required: true,
    },
  ],
});

//handeling delete listing
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(res);
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
