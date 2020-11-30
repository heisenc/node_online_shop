const path = require("path");

const { body } = require("express-validator/check");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body(
      "title",
      "Please enter valid title with all string and at least 3 character"
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat().withMessage("Please enter valid price"),
    // body("imageUrl").isURL().withMessage("Please enter valid URL"),
    body(
      "description",
      "Please enter valid description having at least 5 character and lower than 400 character"
    )
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body(
      "title",
      "Please enter valid title with all string and at least 3 character"
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price").isFloat().withMessage("Please enter valid price"),
    // body("imageUrl").isURL().withMessage("Please enter valid URL"),
    body(
      "description",
      "Please enter valid description having at least 5 character and lower than 400 character"
    )
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.delete("/products/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
