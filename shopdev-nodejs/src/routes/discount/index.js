'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodeWithProducts))

router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))
module.exports = router

