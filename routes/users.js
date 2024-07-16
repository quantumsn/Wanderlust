const express = require("express");
const router = express.Router();
const warpAsync = require("../utilit/warpAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(warpAsync(userController.signupUser));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    warpAsync(userController.loginUser)
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
