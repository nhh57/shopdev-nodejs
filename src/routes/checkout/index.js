'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()

router.use(authenticationV2)

router.post('/review', asyncHandler(checkoutController.checkoutReview))
module.exports = router

