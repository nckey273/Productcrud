const express = require("express");


const ProductController = require("../controllers/product");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();



router.post("",extractFile,ProductController.createProduct);

router.put("/:id",extractFile,ProductController.UpdateProduct);

router.get("", ProductController.getProducts);

router.get("/:id",ProductController.getOneProducts );

router.delete("/:id",ProductController.deleteProduct);

module.exports = router;
