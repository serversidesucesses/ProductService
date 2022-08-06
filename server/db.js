require('dotenv').config();
const { Pool } = require('pg');
const io = require('@pm2/io');
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
})

const currentReqs = io.counter({
  name: 'Realtime request count',
  id: 'app/realtime/requests'
});



const getProducts = (req, res) => {
  currentReqs.inc();
  req.on('end', () => {
    currentReqs.dec();
  })
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  pool.query(`SELECT id, name, slogan, description, category, concat(default_price, '.00') AS default_price FROM products ORDER BY id ASC LIMIT $1 OFFSET $2`, [count, count*(page - 1)])
  .then(({rows}) => res.status(200).json(rows))
  .catch(error => res.status(500).send('Internal Server Error'));
}


const getProductInfoById = (req, res) => {
  const id = parseInt(req.params.product_id);
  currentReqs.inc();
  req.on('end', () => {
    currentReqs.dec();
  })
  pool.query(
 `SELECT
    id,
    name,
    slogan,
    description,
    category,
    concat(default_price, '.00') AS default_price,
    COALESCE(features, '[]') AS features
  FROM products
    CROSS JOIN (
      SELECT json_agg(row_to_json(features_json)) AS features
        FROM (
               SELECT
                  feature,
                  value
                  FROM product_features
               WHERE product_features.product_id = $1
              ) AS features_json
    ) AS result
  WHERE products.id = $1`, [id])
  .then(({rows}) => rows.length > 0 ? res.status(200).json(rows[0]) : res.status(404).send('Product Not Found.'))
  .catch(error => res.status(500).send('Internal Server Error'));


}
//OLD Products query
// WITH product AS (
//   SELECT products.id, name, slogan, description, category, concat(default_price, '.00') AS default_price,
//     (
//       CASE
//          WHEN products.id = $1 AND feature.product_id = $1
//            THEN (json_agg(json_build_object('feature', feature, 'value', value)))
//          ELSE '[]'
//       END
//     ) AS features
//   FROM products
//   LEFT JOIN product_features AS feature
//   ON products.id = feature.product_id
//   WHERE products.id = $1
//   GROUP BY 1,2,3,4,5,6, feature.product_id )
//   SELECT * FROM product`

const getProductStyles = (req, res) => {
  currentReqs.inc();
  req.on('end', () => {
    currentReqs.dec();
  })
  const id = parseInt(req.params.product_id);
  pool.query(`
  WITH productStyle AS (
    SELECT styles.id AS style_id, name, concat(original_price, '.00') AS original_price,
           (
             CASE
               WHEN sale_price = 'null'
                 THEN replace(sale_price, 'null', null)
               ELSE concat(sale_price, '.00')
             END
            ) AS sale_price,
            default_style AS "default?",
           (SELECT COALESCE(json_agg(row_to_json(photo)), '[]') from (SELECT url, thumbnail_url from photos where photos.styleId=styles.id) AS photo) AS photos,
           (SELECT COALESCE(json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size)), json_build_object('null', json_build_object('quantity', null, 'size', null))) FROM skus WHERE skus.styleId = styles.id) AS skus
    FROM styles WHERE styles.productId = $1
    ORDER BY styles.id
  )
  SELECT $2 as product_id, COALESCE(json_agg(row_to_json(productStyle)), '[]') as results FROM productStyle
  `, [id, id.toString()])
  .then(({rows}) => rows.length > 0 ? res.status(200).json(rows[0]) : res.status(404).send('Product Not Found.'))
  .catch(error => res.status(500).send('Internal Server Error'));
}

//OLD query
// WITH productStyle AS (
//   SELECT styles.productId AS product_id, styles.id AS style_id, name, concat(original_price, '.00') AS original_price,
//          (
//            CASE
//              WHEN sale_price = 'null'
//                THEN replace(sale_price, 'null', null)
//              ELSE concat(sale_price, '.00')
//            END
//           ) AS sale_price,
//           default_style,
//           (SELECT json_agg(json_build_object('thumbnail_url', photos.thumbnail_url, 'url', photos.url)) FROM photos WHERE photos.styleId=styles.id) AS photos,
//           (SELECT COALESCE(json_object_agg(skus.id, json_build_object('quantity', skus.quantity, 'size', skus.size)), json_build_object('null', json_build_object('quantity', null, 'size', null))) FROM skus WHERE skus.styleId = styles.id) AS skus
//   FROM styles WHERE styles.productId=$1
//   ORDER BY styles.id
// )
// SELECT product_id,
// (json_agg(json_build_object('style_id', style_id,  'name', name,  'original_price', original_price, 'sale_price', sale_price, 'default?', default_style, 'photos', photos, 'skus', skus))) as results FROM productStyle
//  GROUP BY 1

const getRelatedProducts = (req, res) => {
  currentReqs.inc();
  req.on('end', () => {
    currentReqs.dec();
  })
  const id = parseInt(req.params.product_id);
  pool.query(`
  SELECT
  COALESCE(json_agg(related_product_id), '[]') AS related_products FROM related_products WHERE current_product_id = $1`, [id])
  .then(({rows}) => rows.length > 0 ? res.status(200).json(rows[0].related_products) : res.status(404).send('Product Not Found.'))
  .catch(error => res.status(500).send('Internal Server Error'));
}

module.exports = {
  getProducts,
  getProductInfoById,
  getProductStyles,
  getRelatedProducts
}
