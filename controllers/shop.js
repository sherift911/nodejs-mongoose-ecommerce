//built-in module
const fs = require("fs");
const path = require("path");
//---------------
// 3-party modules
const PDFDocument = require("pdfkit");
//---------------------
//custom modules
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
//---------------
const itemsPerPage = 2;
//---------------

const getProducts = (req, res, next) => {
  const page = Number(req.query.page) || 1;
  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .then((products) => {
          console.log(products);
          res.render("shop/product-list", {
            prods: products,
            pageTitle: "All products",
            path: "/products",
            currentPage: page,
            hasNextPage: itemsPerPage * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemsPerPage),
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/products");
      }
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: `/products`,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getIndex = (req, res, next) => {
  const page = Number(req.query.page) || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .then((products) => {
          res.render("shop/index", {
            prods: products,
            pageTitle: "shop",
            path: "/",
            csrfToken: req.csrfToken(),
            currentPage: page,
            hasNextPage: itemsPerPage * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemsPerPage),
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

const postCard = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

const postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: i.productId.toObject() };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      next(err);
    });
};
const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);
      doc.fontSize(26).text("Invoice", { underline: true });
      doc.text("-------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        const price = prod.quantity * prod.product.price;
        totalPrice += price;
        doc.text(
          `${prod.product.title} _ quantity(${prod.quantity})   X   $${prod.product.price} =  $${price}`,
        );
      });
      doc.text("---------------------");
      doc.text(`total price is ------>  $${totalPrice}`);
      doc.end();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
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
};
