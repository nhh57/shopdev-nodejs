'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler= require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()


// router.use(authenticationV2)
router.post('/shop/create-product', asyncHandler(productController.createProduct))

module.exports = router