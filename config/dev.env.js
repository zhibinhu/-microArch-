'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_HOST: '"http://192.168.205.65:5002"',
    UEDITOR_SERVER_URL:'"http://192.168.205.65:8080"'
})