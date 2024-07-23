'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler= require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProducts))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/:product_id',asyncHandler(productController.findProducts))


router.use(authenticationV2)
router.post('/shop/create-product', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))


router.get('/drafts/all',asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishForShop))
module.exports = router