const axios = require('axios');

describe('return of data from the products/:product_id/styles api endpoint', () => {
  it('has a property of product_id that will be the product\'s id', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data.product_id).toBe(product_id.toString());
    })
    .catch(error => Error(error));
  });

  it('has a property of results', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data).toHaveProperty('results');
    })
    .catch(error => Error(error));
  });

  it('contain\'s style data inside each object property of results', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data).toHaveProperty('results');
    })
    .catch(error => Error(error));
  });

  it('contain\'s name, original_price, sale_price, default?, photo, and sku properties inside each object of results element', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      const { results } = data;
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('style_id');
        expect(styleObj).toHaveProperty('original_price');
        expect(styleObj).toHaveProperty('sale_price');
        expect(styleObj).toHaveProperty('default?');
        expect(styleObj).toHaveProperty('photos');
        expect(styleObj).toHaveProperty('skus');
      });
    })
    .catch(error => Error(error));
  });

  it('Returns dollars and cents amounts for the original_price property', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
      .then(({data}) => {
        const { results } = data;
        results.forEach(styleObj => {
          expect(styleObj).toHaveProperty('original_price');
          expect(styleObj.original_price).toContain('.00')
        })
      });
  });

  it('Either has null for the sale_price or a dollars and cents amounts', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
      .then(({data}) => {
        const { results } = data;
        results.forEach(styleObj => {
          expect(styleObj).toHaveProperty('sale_price');
          if(styleObj.sale_price) {
            expect(styleObj.sale_price).toContain('.00');
          } else {
            expect(styleObj.sale_price).toBe(null);
          }
        })
      });
  });

  it('has default? property to be a boolean inside each object of results element', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      const { results } = data;
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('default?');
        expect(typeof styleObj['default?']).toBe('boolean');
      });
    });
  });

  it('contain\'s thumbnail_url and url properties inside each photos array within the style object nested inside of results', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data).toHaveProperty('results');
      const { results } = data;
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('photos');
        const { photos } = styleObj;
        photos.forEach(photoObj => {
          expect(photoObj).toHaveProperty('thumbnail_url');
          expect(photoObj).toHaveProperty('url');
        })
      });
    });
  });

  it('contain\'s a quantity and size property within each Skus key-value pair ', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data).toHaveProperty('results');
      const { results } = data;
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('skus');
        const { skus } = styleObj;
        for(key in skus) {
          expect(skus[key]).toHaveProperty('quantity');
          expect(skus[key]).toHaveProperty('size');
        }
      });
    });
  });

  it('contain\'s a number for quantity and string size within each Skus key-value pair ', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data).toHaveProperty('results');
      const { results } = data;
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('skus');
        const { skus } = styleObj;
        for(key in skus) {
          expect(skus[key]).toHaveProperty('quantity');
          expect(skus[key]).toHaveProperty('size');
          expect(typeof skus[key].quantity).toBe('number');
          expect(typeof skus[key].size).toBe('string');
        }
      });
    });
  });

  it('Returns product not found as the response with a 404 status code if the product id does not exist', () => {
    axios.get('http://localhost:3000/products/2147483647/styles')
      .then(({data}) => {
      })
      .catch(({response}) => {
        expect(response.status).toBe(404);
        expect(response.data).toBe('Product Not Found.');
      });
    });

    it('Returns internal server error if the product id is out of range', () => {
      axios.get('http://localhost:3000/products/2147483648/styles')
        .then(({data}) => {
        })
        .catch(({response}) => {
          expect(response.status).toBe(500);
          expect(response.data).toBe('Internal Server Error');
        });
      });
});