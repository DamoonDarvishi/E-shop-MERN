const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helpers/error-handler");
const authJwt = require("./helpers/jwt");

require("dotenv/config");

app.use(cors());
app.options("*", cors());

// M i d d l e w a r e
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

// R o u t e r
const categoriesRouter = require("./routers/categories");
const ordersRouter = require("./routers/orders");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);

// D A T A B A S E
// LOCAL
const URL = "mongodb://localhost:27017/eshop-database";
// mongodb atlas
// const URL = process.env.CONNECTION_STRING;
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready ...");
  })
  .catch((err) => {
    console.log(err);
  });

// S E R V E R
app.listen(3000, () => {
  console.log(api);
  console.log("server is running on this port : 3000");
});
