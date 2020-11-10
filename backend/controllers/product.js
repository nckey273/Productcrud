const Product = require("../models/product");

exports.createProduct = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const product = new Product({
    title: req.body.title,
    comment: req.body.comment,
    imagePath: url + "/images/" + req.file.filename,
  });

  product
    .save()
    .then(createdProduct => {
      res.status(201).json({
        message: "product added successfully",
        product: {
          ...createdProduct,
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a product failed!"
      });
    });
}
exports.UpdateProduct = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.id,
    title: req.body.title,
    comment: req.body.comment,
    imagePath: imagePath,

  });
  Product.updateOne({ _id: req.params.id }, product)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate product!"
      });
    });
}
exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then(documents => {
      fetchedProducts = documents;
      return Product.count();
    })
    .then(count => {
      res.status(200).json({
        message: "products fetched successfully!",
        products: fetchedProducts,
        maxproducts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching products  failed!"
      });
    });
}
exports.getOneProducts  = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching product failed!"
      });
    });
}
exports.deleteProduct =  (req, res, next) => {
  Product.deleteOne({ _id: req.params.id})
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting products failed!"
      });
    });
}
