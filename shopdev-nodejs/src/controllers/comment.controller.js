'use strict'
const {
    CreateCommentByProductId,
    getCommentsByParentId,
    deleteComment
} = require('../services/comment.service')
const {SuccessResponse} = require("../core/success.response");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse(
            {
                message: 'Comment Create Success!',
                metadata: await CreateCommentByProductId(req.body)
            }
        ).send(res)
    }


    getCommentByParentId = async (req, res, next) => {
        new SuccessResponse(
            {
                message: 'Comment Create Success!',
                metadata: await getCommentsByParentId(req.query)
            }
        ).send(res)
    }


    deleteComment = async (req, res, next) => {
        new SuccessResponse(
            {
                message: 'delete Comment Success!',
                metadata: await deleteComment(req.body)
            }
        ).send(res)
    }
}

module.exports = new CommentController()