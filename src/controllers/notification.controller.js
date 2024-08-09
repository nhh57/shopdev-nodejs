'use strict'
const {
    listNotiByUser
} = require('../services/notification.service')
const {SuccessResponse} = require("../core/success.response");

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse(
            {
                message: 'create new listNotiByUser!',
                metadata: await listNotiByUser(req.query)
            }
        ).send(res)
    }

}

module.exports = new NotificationController()