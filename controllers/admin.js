const { validationResult } = require("express-validator/check");

const fileHelper = require("../util/file");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // protect route without using middleware
  // if(!req.session.isLoggedIn){
  //   return res.redirect('/login');
  // }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  const image = req.file;
  const price = +req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  console.log(image);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // handling minor error
      //   return res.status(500).render("admin/edit-product", {
      //     pageTitle: "Add Product",
      //     path: "/admin/add-product",
      //     editing: false,
      //     hasError: true,
      //     product: {
      //       title,
      //       imageUrl,
      //       price,
      //       description,
      //     },
      //     errorMessage: 'database operation failed, please try again latter.',
      //     validationErrors: [],
      //   });
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) {
        fileHelper.deleteFlie(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.description = updatedDesc;
      return product.save().then((result) => {
        console.log("updated product!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// delete product via form
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then((product) => {
//       if (!product) {
//         const error = new Error("Product not found.");
//         error.name = "customError";
//         return console.error;
//       }
//       fileHelper.deleteFlie(product.imageUrl);
//       return Product.deleteOne({ _id: prodId, userId: req.user._id })
//         .then((result) => {
//           console.log(result);
//           res.redirect("/admin/products");
//         })
//         .catch((err) => {
//           const error = new Error(err);
//           error.httpStatusCode = 500;
//           return next(error);
//         });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

// delete product via json
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(500).json({ message: "deleting product failed!" });
      }
      fileHelper.deleteFlie(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then((result) => {
          console.log(result);
          return res.status(200).json({ message: "Success!" });
        })
    })
    .catch((err) => {
      return res.status(500).json({ message: "deleting product failed!" });
    });
};
