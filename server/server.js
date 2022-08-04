require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get('/loaderio-6975f53fc9210147e1b8c34fd8787b3a/', (req, res) => {
  res.status(200).send('loaderio-6975f53fc9210147e1b8c34fd8787b3a')
});

app.get('/loaderio-df7c0532870ca07e9decc1388a8cc47b/', (req, res) => {
  res.status(200).send('loaderio-df7c0532870ca07e9decc1388a8cc47b')
});



app.get('/products', db.getProducts);
app.get('/products/:product_id', db.getProductInfoById);
app.get('/products/:product_id/styles', db.getProductStyles);
app.get('/products/:product_id/related', db.getRelatedProducts);

app.listen(port, () => {
  console.log(`Sever running on port ${port}.`)
})
