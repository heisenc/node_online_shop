const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);

// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");
// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? mongodb.ObjectID.createFromHexString(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(`result ${result}`);
//       })
//       .catch(console.log);
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
//       .catch(console.log);
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .findOne({ _id: mongodb.ObjectID.createFromHexString(prodId) })
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch(console.log);
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: mongodb.ObjectID.createFromHexString(prodId) })
//       .then((result) => {
//         console.log("delete product!");
//         return result;
//       })
//       .catch(console.log);
//   }

// }

// module.exports = Product;
