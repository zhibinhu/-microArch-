/* /config/test.env.js */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"pre"',
    API_HOST: '"http://192.168.205.65:5002"'
})