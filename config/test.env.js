/* /config/test.env.js */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"test"',
    API_HOST: '"http://114.116.99.98:5002"'
})