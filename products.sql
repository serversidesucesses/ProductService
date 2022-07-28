
DROP TABLE IF EXISTS products, styles, product_features, skus, photos, related_products CASCADE;

CREATE TABLE products (
  id serial primary key,
  name text,
  category text,
  slogan text unique,
  description text,
  default_price text not null
);

CREATE TABLE styles (
  id serial primary key,
  name text not null,
  original_price text not null,
  sale_price text,
  default_style bit not null,
  productId serial references Products(id)
);

CREATE TABLE product_features (
  id serial primary key,
  feature text default null,
  value text default null,
  product_id int references Products(id)
);

CREATE TABLE photos (
  id serial primary key,
  thumbnail_url text default null,
  url text default null,
  styleId int references Styles(id)
);

CREATE TABLE skus (
  id serial primary key,
  quantity int default null,
  size text default null,
  styleId int references Styles(id)
);

CREATE TABLE related_products (
  id serial primary key,
  current_product_id int references Products(id),
  related_product_id int
);

COPY products FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/product.csv' csv header;
COPY styles (id,productId,name,sale_price,original_price,default_style) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/styles.csv' csv header;
COPY product_features (id,product_id,feature,value) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/features.csv' csv header;
COPY photos (id,styleId,url,thumbnail_url) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/photos.csv' csv header;
COPY related_products (id,current_product_id,related_product_id) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/related.csv' csv header;
COPY skus (id,styleId,size,quantity) FROM '/Users/c/Desktop/Hack Reactor/SDC/ProductService/DATA/skus.csv' csv header;