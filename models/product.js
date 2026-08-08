const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Product", productSchema);

// const { mongoConnect, getDb } = require("../util/database");
// const mongodb = require("mongodb");

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     if (id) {
//       this._id = new mongodb.ObjectId(id);
//     }
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //update product
//       dbOp = db.collection("products").updateOne(
//         { _id: this._id },
//         {
//           $set: {
//             title: this.title,
//             price: this.price,
//             imageUrl: this.imageUrl,
//             description: this.description,
//           },
//         },
//       );
//     } else {
//       //new product
//       dbOp = db.collection("products").insertOne(this);
//     }

//     return dbOp
//       .then((result) => {
//         console.log(result);
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static findByID(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .findOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }
//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         console.log("deleting done");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = { Product };
