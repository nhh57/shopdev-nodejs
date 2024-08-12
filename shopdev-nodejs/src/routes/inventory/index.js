'use strict'

const express = require('express')
const inventoryController = require('../../controllers/inventory.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()


router.use(authenticationV2)

router.get('', asyncHandler(inventoryController.addStockToInventory))
module.exports = router

