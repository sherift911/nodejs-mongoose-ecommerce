//modules
const adminData = require("./admin");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCard,
  postCartDelete,
  postOrders,
  getInvoice,
} = require("../controllers/shop");
const {
  getAddProduct,
  postAddProduct,
  getProductsAdmin,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
//built - in module
const path = require("path");
//3 party modules
const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCard);

router.post("/cart-delete-item", isAuth, postCartDelete);

router.get("/orders", isAuth, getOrders);

router.post("/create-order", isAuth, postOrders);

// // //dynamic segments
router.get("/products/:productId", getProduct);

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
