import { sleep, check } from 'k6';
import http from 'k6/http';

export const options = {
  ext: {
    loadimpact: {
      distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
      apm: []
    }
  },
  thresholds: {
    http_req_duration: ['p(99)<=500', 'p(95)<=250', 'p(90)<=200'],
    http_req_failed: ['rate<=0.01']
  },
  scenarios: {
    High_Traffic: {
      executor: 'ramping-vus',
      startTime: '0s',
      gracefulStop: '30s',
      stages: [
        { target: 100, duration: '30s' },
        { target: 1000, duration: '1m' },
        { target: 3000, duration: '45s' },
        { target: 1000, duration: '2m' },
        { target: 100, duration: '60s' },
      ],
      startVUs: 50,
      gracefulRampDown: '30s',
      exec: 'high_Traffic'
    },
    Mid_Traffic: {
      executor: 'ramping-vus',
      startTime: '0s',
      gracefulStop: '30s',
      stages: [
        { target: 100, duration: '30s' },
        { target: 200, duration: '1m' },
        { target: 1000, duration: '1m' },
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
        { target: 230, duration: '3m' },
        { target: 140, duration: '2m' },
        { target: 90, duration: '60s' },
      ],
      startVUs: 50,
      gracefulRampDown: '30s',
      exec: 'low_Traffic'
    }
  }
}


export function high_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50');
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // styles
  response = http.get('http://localhost:3000/products/50/styles');
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // related products
  response = http.get('http://localhost:3000/products/50/related');
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // product details
  response = http.get('http://localhost:3000/products/50/');
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  sleep(1);
}

// Scenario: Mid_Traffic (executor: ramping-vus)

export function mid_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // styles
  response = http.get('http://localhost:3000/products/50/styles')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // related products
  response = http.get('http://localhost:3000/products/50/related')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // product details
  response = http.get('http://localhost:3000/products/50/')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  sleep(1);
}



export function low_Traffic() {
  let response;

  // products (50 count)
  response = http.get('http://localhost:3000/products?count=50')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // styles
  response = http.get('http://localhost:3000/products/50/styles')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // related products
  response = http.get('http://localhost:3000/products/50/related')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  // product details
  response = http.get('http://localhost:3000/products/50/')
  check(response, { 'status equals 200': response => response.status.toString() === '200' })

  sleep(1)
}
