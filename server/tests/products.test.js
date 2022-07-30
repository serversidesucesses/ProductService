const axios = require('axios');





describe('return of data from the /products api endpoint', () => {
  it('Returns 5 products with the correct properties', () => {
  axios.get('http://localhost:3000/products')
    .then(({data}) => {
      data.forEach(productObject => {
        expect(productObject).toHaveProperty('id');
        expect(productObject).toHaveProperty('name');
        expect(productObject).toHaveProperty('slogan');
        expect(productObject).toHaveProperty('description');
        expect(productObject).toHaveProperty('category');
        expect(productObject).toHaveProperty('default_price');
      });
    });
  });

  it('Receives the first 5 products when sending a get request to /products with no params', () => {
    axios.get('http://localhost:3000/products')
    .then(({data}) => {
      expect(data.length).toBe(5)
      expect(data[0].id).toBe(1);
      expect(data[1].id).toBe(2);
      expect(data[2].id).toBe(3);
      expect(data[3].id).toBe(4);
      expect(data[4].id).toBe(5);

      expect(data[0].name).toBe('Camo Onesie');
      expect(data[1].name).toBe('Bright Future Sunglasses');
      expect(data[2].name).toBe('Morning Joggers');
      expect(data[3].name).toBe('Slacker\'s Slacks');
      expect(data[4].name).toBe('Heir Force Ones');
    });
  });

  it('Receives the next 5 products when sending a get request to /products with the param of page set to 2', () => {
    axios.get('http://localhost:3000/products', {params: {page: 2}})
    .then(({data}) => {
      expect(data.length).toBe(5)
      expect(data[0].id).toBe(6);
      expect(data[1].id).toBe(7);
      expect(data[2].id).toBe(8);
      expect(data[3].id).toBe(9);
      expect(data[4].id).toBe(10);

      expect(data[0].name).toBe('Pumped Up Kicks');
      expect(data[1].name).toBe('Blues Suede Shoes');
      expect(data[2].name).toBe('YEasy 350');
      expect(data[3].name).toBe('Summer Shoes');
      expect(data[4].name).toBe('Infinity Stone');
    });
  });

  it('Receives the 500 products when sending a get request to /products with the param of count set to 500', () => {
    axios.get('http://localhost:3000/products', {params: {count: 500}})
    .then(({data}) => {
    expect(data.length).toBe(500);
    });
  });

  it('Receives the 500 products starting from id 501 to 1000 when sending a get request to /products with the param of count set to 500 and page set to 2', () => {
    axios.get('http://localhost:3000/products', {params: {count: 500, page: 2}})
    .then(({data}) => {
    expect(data.length).toBe(500);
    expect(data[0].id).toBe(501);
    expect(data[data.length-1].id).toBe(1000);
    });
  });
});