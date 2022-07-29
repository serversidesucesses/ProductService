const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db.js');
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  response.json("Hey")
})

app.get('/products', db.getProducts)
app.get('/products/:product_id', db.getProductInfoById)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
