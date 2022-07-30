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
    });
  });

  it('Returns a product with an empty features array if there are no product features', () => {
    const Features = []
  axios.get('http://localhost:3000/products/10')
    .then(({data}) => {
      expect(data.id).toBe(10);
      expect(data.name).toBe('Infinity Stone');
      expect(data).toHaveProperty('features');
      expect(data.features).toEqual(Features);
    });
  });
});

