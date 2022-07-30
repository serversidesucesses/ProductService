require('dotenv').config({path: '../.env'});
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
})
const getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  pool.query(`SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`, [count, count*(page - 1)])
  .then(({rows}) => res.status(200).json(rows))
  .catch(error => res.status(500).send('Internal Server Error'));
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
    GROUP BY 1, 2, 3, 4, 5, 6)
  SELECT * FROM product`, [id])
  .then(({rows}) => res.status(200).json(rows))
  .catch(error => res.status(500).send('Internal Server Error'));
}

const getProductStyles = (req, res) => {
  const id = parseInt(req.params.product_id);
  pool.query(`
  WITH productStyle AS (
    SELECT styles.productId as product_id, styles.id AS style_id, name, original_price, sale_price, default_style,
    (SELECT json_agg(json_build_object('thumbnail_url', photos.thumbnail_url, 'url', photos.url)) FROM photos WHERE photos.styleId=styles.id) AS photos,
    (SELECT json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size)) FROM skus WHERE skus.styleId = styles.id) AS skus
    FROM styles WHERE styles.productId=$1
    ORDER BY styles.id
  )
  SELECT product_id,
  (json_agg(json_build_object('style_id', style_id,  'name', name,  'original_price', original_price, 'sale_price', sale_price, 'default?', default_style, 'photos', photos, 'skus', skus))) as results FROM productStyle
   GROUP BY 1
  `, [id])
  .then(({rows}) => res.status(200).json(rows))
  .catch(error => res.status(500).send('Internal Server Error'));
}

const getRelatedProducts = (req, res) => {
  const id = parseInt(req.params.product_id);
  pool.query(`SELECT json_agg(related_product_id) AS related_products FROM related_products WHERE current_product_id = $1`, [id])
  .then(({rows}) => res.status(200).json(rows[0].related_products))
  .catch(error => res.status(500).send('Internal Server Error'));
}

module.exports = {
  getProducts,
  getProductInfoById,
  getProductStyles,
  getRelatedProducts
}
