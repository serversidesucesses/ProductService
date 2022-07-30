const axios = require('axios');

describe('return of data from the products/:product_id/styles api endpoint', () => {
  it('returns an array of numbers', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      data.forEach(element => {
        expect(typeof element).toBe('number')
      })
    });
  });

  it('returns the correct array of productIds for a product', () => {
    const product_id = 1;
    const RelatedArray = [2,3,8,7];
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      expect(data).toEqual(RelatedArray);
    });
  });

  it('returns an empty array for a product who has no related product ids', () => {
    const product_id = 10;
    const emptyArray = [];
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      expect(data).toEqual(emptyArray);
    });
  });

});