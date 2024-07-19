'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler= require("../../helpers/asyncHandler");
const {authentication, authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
router.use(authenticationV2)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handler-refresh-token', asyncHandler(accessController.handlerRefreshToken))

module.exports = router