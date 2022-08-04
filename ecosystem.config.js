module.exports = {
  apps : [{
    name   : "SDC-BACKEND",
    script : "./server/server.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}