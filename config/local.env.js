/* /config/test.env.js */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"local"',
    API_HOST: '"http://127.0.0.1:5002"'
})