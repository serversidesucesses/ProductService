
DROP TABLE IF EXISTS products, styles, product_features, skus, photos, related_products CASCADE;
--id,name,slogan,description,category,default_price
CREATE TABLE products (
  id serial primary key,
  name text,
  slogan text,
  description text,
  category text,
  default_price text not null
);

CREATE TABLE styles (
  id serial primary key,
  productId int references products(id),
  name text not null,
  sale_price text,
  original_price text not null,
  default_style bit not null
);

CREATE TABLE product_features (
  id serial primary key,
  feature text default null,
  value text default null,
  product_id int references products(id)
);

CREATE TABLE photos (
  id serial primary key,
  styleId int references styles(id),
  url text default null,
  thumbnail_url text default null
);

CREATE TABLE skus (
  id serial primary key,
  quantity int default null,
  size text default null,
  styleId int references styles(id)
);

CREATE TABLE related_products (
  id serial primary key,
  current_product_id int references products(id),
  related_product_id int
);

COPY products FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/product.csv' csv header;
COPY styles (id,productId,name,sale_price,original_price,default_style) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/styles.csv' csv header;
COPY product_features (id,product_id,feature,value) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/features.csv' csv header;
COPY photos (id,styleId,url,thumbnail_url) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/photos.csv' csv header;
COPY related_products (id,current_product_id,related_product_id) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/related.csv' csv header;
COPY skus (id,styleId,size,quantity) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/skus.csv' csv header;