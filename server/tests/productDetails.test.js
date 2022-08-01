const axios = require('axios');

describe('return of data from the products/:product_id api endpoint ', () => {
  it('Returns 1 product with the features displayed as an array', () => {
    const Features = [{ feature: 'Fabric', value: 'Canvas' }, { feature: 'Buttons', value: 'Brass' }]
  axios.get('http://localhost:3000/products/1')
    .then(({data}) => {
      expect(data.id).toBe(1);
      expect(data.name).toBe('Camo Onesie');
      expect(data).toHaveProperty('features');
      expect(data.features).toEqual(Features);
    })
    .catch(error => Error(error));
  });

  it('Returns a product with an empty features array if there are no product features', () => {
    const Features = []
  axios.get('http://localhost:3000/products/10')
    .then(({data}) => {
      expect(data.id).toBe(10);
      expect(data.name).toBe('Infinity Stone');
      expect(data).toHaveProperty('features');
      expect(data.features).toEqual(Features);
    })
    .catch(error => Error(error));
  });

  it('Returns product not found as the response with a 404 status code if the product id does not exist', () => {
  axios.get('http://localhost:3000/products/2147483647')
    .then(({data}) => {
    })
    .catch(({response}) => {
      expect(response.status).toBe(404);
      expect(response.data).toBe('Product Not Found.');
    });
  });

  it('Returns internal server error if the product id is out of range', () => {
    axios.get('http://localhost:3000/products/2147483648')
      .then(({data}) => {
      })
      .catch(({response}) => {
        expect(response.status).toBe(500);
        expect(response.data).toBe('Internal Server Error');
      });
    });
});

