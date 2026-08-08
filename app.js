//built-in
const express = require("express");
const app = express();
//------------------
const mongoose = require("mongoose");
//--------------
// 3-party modules
require("dotenv").config();
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
//-----------------------
const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ac-1tdfvn2-shard-00-00.orohmu2.mongodb.net:27017,ac-1tdfvn2-shard-00-01.orohmu2.mongodb.net:27017,ac-1tdfvn2-shard-00-02.orohmu2.mongodb.net:27017/shop?ssl=true&replicaSet=atlas-12q7vc-shard-0&authSource=admin&appName=Cluster0`;
//-------------
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

// files multer module
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//----------------------
store.on("error", (err) => {
  console.log("session store err", err);
});
//modules
const { get404 } = require("./controllers/error");
const User = require("./models/user");
//-------------------------------------
// templating engine
app.set("view engine", "ejs");
app.set("views", "views");
//---------------------------------
//routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
//----------------------------------

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use(flash());
// for users
app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(err);
    });
});

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
//----------------------
//routes
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);
//------------------

//404 handler
app.use(get404);
//----------------

//central errors handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "500 page",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});
//-----------------

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
