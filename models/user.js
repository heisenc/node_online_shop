const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Order = require("./order");
const product = require("./product");

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  if (cartProductIndex === -1) {
    this.cart.items.push({ productId: product._id, quantity: 1 });
  } else {
    this.cart.items[cartProductIndex].quantity++;
  }
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  return this.save();
};

userSchema.methods.addOrder = function () {
  let products;
  return this.populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      products = user.cart.items.map((item) => {
        const p = {};
        p.product = {
          ...item.productId._doc,
        };
        p.quantity = item.quantity;
        console.log(`p.product: ${p.product}`);
        return p;
      });
      order = new Order({
        products: products,
        user: { userId: this._id, email: this.email },
      });
      return order.save();
    })
    .then((result) => {
      this.cart.items = [];
      console.log(`this: ${this}`);
      return this.save();
    });
};

module.exports = mongoose.model("User", userSchema);

// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart || { items: [] };
//     this._id = id ? id : null;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     if (cartProductIndex === -1) {
//       this.cart.items.push({ productId: product._id, quantity: 1 });
//     } else {
//       this.cart.items[cartProductIndex].quantity++;
//     }
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//   }

//   getCart() {
//     const productIds = this.cart.items.map((item) => item.productId);
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         let updateCartDbOp = null;
//         if (products.length !== productIds.length) {
//           this.cart.items = this.cart.items.filter((item) =>
//             products.find((p) => p._id.toString() === item.productId.toString())
//           );
//           updateCartDbOp =  db
//             .collection("users")
//             .updateOne(
//               { _id: this._id },
//               { $set: { "cart.items": this.cart.items } }
//             );
//         }
//         let getCartItemArray = () => products.map((product) => {
//           product.quantity = this.cart.items.find(
//             (item) => item.productId.toString() === product._id.toString()
//           ).quantity;
//           return product;
//         });
//         if(updateCartDbOp){
//           return updateCartDbOp.then(getCartItemArray);
//         }
//         return getCartItemArray();
//       });
//   }

//   deletecartItem(productId) {
//     this.cart.items = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: this._id },
//         { $set: { "cart.items": this.cart.items } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: this._id },
//             { $set: { "cart.items": this.cart.items } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: mongodb.ObjectID.createFromHexString(userId) });
//   }
// }

// module.exports = User;
