const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

const app = express();
mongoose.connect("mongodb://niz:fkj4cJEhJiUVt9rI@cluster0-shard-00-00.jb8hh.mongodb.net:27017,cluster0-shard-00-01.jb8hh.mongodb.net:27017,cluster0-shard-00-02.jb8hh.mongodb.net:27017/node-angular?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
, { useUnifiedTopology: true,useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error+"Connection failed!");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", productRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
