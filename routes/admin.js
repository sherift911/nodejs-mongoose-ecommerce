const path = require("path");
// -------------------
// 3 party modules
const { body, check } = require("express-validator");
//---------------------
// customs modules
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCard,
  postCartDelete,
} = require("../controllers/shop");
const {
  getAddProduct,
  postAddProduct,
  getProductsAdmin,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
const isAdmin = require("../middleware/is-admin");
//----------------------------------
const express = require("express");
const { title } = require("process");
const app = express();
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// store data
const product = [];

//rounting
// Get  /admin/
router.get("/add-product", isAuth, isAdmin, getAddProduct);
// // Post  /admin/
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  isAdmin,
  postAddProduct,
);
router.get("/products", isAuth, isAdmin, getProductsAdmin);
router.post("/delete-product", isAuth, isAdmin, postDeleteProduct);
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  isAdmin,
  postEditProduct,
);
// // //dynamic Routes
router.get("/edit-product/:productId", isAuth, isAdmin, getEditProduct);

module.exports = router;
