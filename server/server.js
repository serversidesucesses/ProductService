require('dotenv').config();
const express = require('express');
const cors = require('cors');
const io = require('@pm2/io')
const db = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get('/loaderio-6975f53fc9210147e1b8c34fd8787b3a/', (req, res) => {
  res.status(200).send('loaderio-6975f53fc9210147e1b8c34fd8787b3a')
});

app.get('/loaderio-0071278d79288f51bbd8a4506b1bddd5/', (req, res) => {
  res.status(200).send('lloaderio-0071278d79288f51bbd8a4506b1bddd5')
});

app.get('/loaderio-4c9cff767d782ee61eceb58a64b93a5f/', (req, res) => {
  res.status(200).send('loaderio-4c9cff767d782ee61eceb58a64b93a5f')
});




app.get('/products', db.getProducts);
app.get('/products/:product_id', db.getProductInfoById);
app.get('/products/:product_id/styles', db.getProductStyles);
app.get('/products/:product_id/related', db.getRelatedProducts);
app.use(io.expressErrorHandler());
app.listen(port, () => {
  console.log(`Sever running on port ${port}.`)
})
