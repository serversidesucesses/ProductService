import { sleep, check } from 'k6';
import http from 'k6/http';

let scenarios = {
  high_Traffic: {
    executor: 'ramping-vus',
    startTime: '0s',
    gracefulStop: '30s',
    stages: [
      { target: 100, duration: '30s' },
      { target: 1000, duration: '30s' },
      { target: 5000, duration: '2m' },
      { target: 1000, duration: '1m' },
      { target: 100, duration: '60s' },
    ],
    startVUs: 50,
    gracefulRampDown: '30s',
    exec: 'high_Traffic'
  },
  mid_Traffic: {
    executor: 'ramping-vus',
    startTime: '0s',
    gracefulStop: '30s',
    stages: [
      { target: 100, duration: '30s' },
      { target: 200, duration: '1m' },
      { target: 2000, duration: '1m' },
      { target: 400, duration: '2m' },
      { target: 100, duration: '60s' },
    ],
    startVUs: 50,
    gracefulRampDown: '30s',
    exec: 'mid_Traffic'
  },
  low_Traffic: {
    executor: 'ramping-vus',
    startTime: '0s',
    gracefulStop: '30s',
    stages: [
      { target: 100, duration: '30s' },
      { target: 175, duration: '1m' },
      { target: 1000, duration: '3m' },
      { target: 140, duration: '2m' },
      { target: 90, duration: '60s' },
    ],
    startVUs: 50,
    gracefulRampDown: '30s',
    exec: 'low_Traffic'
  },
  constant_rate_products: {
    executor: 'constant-arrival-rate',
    rate: 6000,
    timeUnit: '1s',
    duration: '30s',
    preAllocatedVUs: 250,
    maxVUs: 20000,
    exec: 'constant_rate_products'
  },
  constant_rate_product_details: {
    executor: 'constant-arrival-rate',
    rate: 6000,
    timeUnit: '1s',
    duration: '30s',
    preAllocatedVUs: 250,
    maxVUs: 20000,
    exec: 'constant_rate_product_details'
  },
  constant_rate_styles: {
    executor: 'constant-arrival-rate',
    rate: 6000,
    timeUnit: '1s',
    duration: '30s',
    preAllocatedVUs: 250,
    maxVUs: 20000,
    exec: 'constant_rate_styles'
  },
  constant_rate_related: {
    executor: 'constant-arrival-rate',
    rate: 6000,
    timeUnit: '1s',
    duration: '30s',
    preAllocatedVUs: 250,
    maxVUs: 20000,
    exec: 'constant_rate_related'
  },
}

export const options = {
  thresholds: {
    http_req_duration: ['p(99)<=2000', 'p(95)<=1500', 'p(90)<=1000'],
    http_req_failed: ['rate<=0.01']
  },
  scenarios: {}
}

if (__ENV.scenario) {
  options.scenarios[__ENV.scenario] = scenarios[__ENV.scenario];
} else {
  options.scenarios = scenarios;
}

export function high_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // styles
  response = http.get('http://localhost:3000/products/999999/styles');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // related products
  response = http.get('http://localhost:3000/products/500000/related');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // product details
  response = http.get('http://localhost:3000/products/999999/');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  sleep(1);
}

export function mid_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // styles
  response = http.get('http://localhost:3000/products/50/styles');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // related products
  response = http.get('http://localhost:3000/products/50/related');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // product details
  response = http.get('http://localhost:3000/products/50/')
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  sleep(1);
}



export function low_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // styles
  response = http.get('http://localhost:3000/products/50/styles');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // related products
  response = http.get('http://localhost:3000/products/50/related')
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  // product details
  response = http.get('http://localhost:3000/products/50/')
  check(response, { 'status equals 200': response => response.status.toString() === '200' });

  sleep(1);
}

export function constant_rate_products() {
  let response = http.get('http://localhost:3000/products');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });
}
export function constant_rate_product_details() {
  let response = http.get('http://localhost:3000/products/999990');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });
}

export function constant_rate_styles() {
  let response = http.get('http://localhost:3000/products/999990/styles');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });
}

export function constant_rate_related() {
  let response = http.get('http://localhost:3000/products/999990/related');
  check(response, { 'status equals 200': response => response.status.toString() === '200' });
}
