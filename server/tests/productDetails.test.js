const axios = require('axios');



describe('return of data from the products/:product_id api endpoint ', () => {
  it('Returns 1 product with the features displayed as an array', () => {
    const Features = [{ feature: 'Fabric', value: 'Canvas' }, { feature: 'Buttons', value: 'Brass' }]
  axios.get('http://localhost:3000/products/1')
    .then(({data}) => {
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe('Camo Onesie');
      expect(data[0]).toHaveProperty('features');
      expect(data[0].features).toEqual(Features);
    });
  });
});

