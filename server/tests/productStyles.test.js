const axios = require('axios');

describe('return of data from the products/:product_id/styles api endpoint', () => {
  it('has a property of product_id that will be the product\'s id', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data[0].product_id).toBe(product_id);
    });
  });

  it('has a property of results', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data[0]).toHaveProperty('results');
    });
  });

  it('contain\'s style data inside each object property of results', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      expect(data[0]).toHaveProperty('results');
    });
  });

  it('contain\'s name, original_price, sale_price, default?, photo, and sku properties inside each object of results element', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      const { results } = data[0];
      results.forEach(styleObj => {
        expect(styleObj).toHaveProperty('style_id');
        expect(styleObj).toHaveProperty('original_price');
        expect(styleObj).toHaveProperty('sale_price');
        expect(styleObj).toHaveProperty('default?');
        expect(styleObj).toHaveProperty('photos');
        expect(styleObj).toHaveProperty('skus');
      });
    });
  });

  it('has default? property to be a boolean inside each object of results element', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/styles`)
    .then(({data}) => {
      const { results } = data[0];
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
      expect(data[0]).toHaveProperty('results');
      const { results } = data[0];
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
      expect(data[0]).toHaveProperty('results');
      const { results } = data[0];
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
      expect(data[0]).toHaveProperty('results');
      const { results } = data[0];
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
});