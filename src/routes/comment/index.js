'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const asyncHandler = require("../../helpers/asyncHandler");
const {authenticationV2} = require("../../auth/auth.Utils");
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentByParentId))
router.delete('', asyncHandler(commentController.deleteComment))

module.exports = router

