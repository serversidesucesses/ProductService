const axios = require('axios');

describe('return of data from the products/:product_id/styles api endpoint', () => {
  it('returns an array of numbers', () => {
    const product_id = 1;
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      data.forEach(element => {
        expect(typeof element).toBe('number')
      })
    })
    .catch(error => Error(error));
  });

  it('returns the correct array of productIds for a product', () => {
    const product_id = 1;
    const RelatedArray = [2,3,8,7];
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      expect(data).toEqual(RelatedArray);
    })
    .catch(error => Error(error));
  });

  it('returns an empty array for a product who has no related product ids', () => {
    const product_id = 10;
    const emptyArray = [];
    axios.get(`http://localhost:3000/products/${product_id}/related`)
    .then(({data}) => {
      expect(data).toEqual(emptyArray);
    })
    .catch(error => Error(error));
  });

  it('Returns product not found as the response with a 404 status code if the product id does not exist', () => {
    axios.get('http://localhost:3000/products/2147483647/related')
      .then(({data}) => {
      })
      .catch(({response}) => {
        expect(response.status).toBe(404);
        expect(response.data).toBe('Product Not Found.');
      });
    });

    it('Returns internal server error if the product id is out of range', () => {
      axios.get('http://localhost:3000/products/2147483648/related')
        .then(({data}) => {
        })
        .catch(({response}) => {
          expect(response.status).toBe(500);
          expect(response.data).toBe('Internal Server Error');
        });
      });
});