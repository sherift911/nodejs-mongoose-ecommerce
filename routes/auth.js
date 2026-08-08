const express = require("express");
const router = express.Router();
// customs modules
const User = require("../models/user");
//---------------
// 3 party modules
const { body, check } = require("express-validator");
//-----------------
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
//-------------------

router.get("/login", getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("not valid email please enter valid email"),
    body("password", "not valid password must be 5 length")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  postLogin,
);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("please enter valid email")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "this email already exist, use different one",
            );
          }
        });
      }),
    body("password", "please enter valid password 5 length atleast")
      .isLength({ min: 5 })
      .trim()
      .isAlphanumeric(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("password not equal");
        }
        return true;
      }),
  ],
  postSignup,
);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
