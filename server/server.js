require('dotenv').config({path: '../.env'});
const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get('/products', db.getProducts);
app.get('/products/:product_id', db.getProductInfoById);
app.get('/products/:product_id/styles', db.getProductStyles);
app.get('/products/:product_id/related', db.getRelatedProducts);

app.listen(port, () => {
  console.log(`Sever running on port ${port}.`)
})
