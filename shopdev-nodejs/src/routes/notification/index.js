'use strict'

const express = require('express')
const NotificationController = require('../../controllers/notification.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()


router.use(authenticationV2)
router.get('', asyncHandler(NotificationController.listNotiByUser))
module.exports = router

