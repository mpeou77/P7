const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/api/posts", postRoutes);
app.use("/api", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
