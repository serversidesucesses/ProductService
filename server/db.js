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
  pool.query(`SELECT name, slogan, description, category, concat(default_price, '.00') AS default_price FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`, [count, count*(page - 1)])
  .then(({rows}) => res.status(200).json(rows))
  .catch(error => res.status(500).send('Internal Server Error'));
}


const getProductInfoById = (req, res) => {
  const id = parseInt(req.params.product_id)
  pool.query(
 `WITH product AS (
  SELECT products.id, name, slogan, description, category, concat(default_price, '.00') AS default_price,
    (
      CASE
         WHEN products.id = $1 AND feature.product_id = $1
           THEN (json_agg(json_build_object('feature', feature, 'value', value)))
         ELSE '[]'
      END
    ) AS features
  FROM products
  LEFT JOIN product_features AS feature
  ON products.id = feature.product_id
  WHERE products.id = $1
  GROUP BY 1,2,3,4,5,6, feature.product_id )
  SELECT * FROM product`, [id])
  .then(({rows}) => res.status(200).json(rows[0]))
  .catch(error => res.status(500).send(error/*'Internal Server Error'*/));
}

const getProductStyles = (req, res) => {
  const id = parseInt(req.params.product_id);
  pool.query(`
  WITH productStyle AS (
    SELECT styles.productId AS product_id, styles.id AS style_id, name, concat(original_price, '.00') AS original_price,
           (
             CASE
               WHEN sale_price = 'null'
                 THEN replace(sale_price, 'null', null)
               ELSE concat(sale_price, '.00')
             END
            ) AS sale_price,
            default_style,
            (SELECT json_agg(json_build_object('thumbnail_url', photos.thumbnail_url, 'url', photos.url)) FROM photos WHERE photos.styleId=styles.id) AS photos,
            (SELECT json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size)) FROM skus WHERE skus.styleId = styles.id) AS skus
    FROM styles WHERE styles.productId=$1
    ORDER BY styles.id
  )
  SELECT product_id,
  (json_agg(json_build_object('style_id', style_id,  'name', name,  'original_price', original_price, 'sale_price', sale_price, 'default?', default_style, 'photos', photos, 'skus', skus))) as results FROM productStyle
   GROUP BY 1
  `, [id])
  .then(({rows}) => res.status(200).json(rows[0]))
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
