const { Pool } = require('pg')
const pool = new Pool({
  user: 'c',
  host: 'localhost',
  database: 'products',
  port: 5432,
})
const getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  pool.query(`SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`, [count, count*(page - 1)], (error, results) => {
    error ? console.log(error)
          : res.status(200).json(results.rows)

  })
}

const getProductInfoById = (req, res) => {
  const id = parseInt(req.params.product_id)
  pool.query(
  `WITH product AS
    (SELECT products.id, name, slogan, description, category, default_price,
      json_agg(json_build_object('feature', feature, 'value', value)) AS features
    FROM products, product_features
      WHERE product_features.product_id = products.id
        AND products.id = $1
    GROUP  BY 1, 2, 3, 4, 5, 6)
  SELECT * FROM   product`, [id], (error, results) => {
    error ? console.log(error)
          : res.status(200).json(results.rows)
  })
}

module.exports = {
  getProducts,
  getProductInfoById,
}
