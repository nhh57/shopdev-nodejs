"use strict";

const AccessService = require('../services/access.service')
const {CREATED, SuccessResponse} = require("../core/success.response");

class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        console.log(`[P]::handlerRefreshToken::`, req.body.refreshToken);
        new SuccessResponse({
            message: "Get token success!",
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send((res))
    }

    logout = async (req, res, next) => {
        console.log(`[P]::logout::`, req.keyStore);
        new SuccessResponse({
            message: "Logout success!",
            metadata: await AccessService.logout({keyStore:req.keyStore})
        }).send((res))
    }
    login = async (req, res, next) => {
        console.log(`[P]::login::`, req.body);
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send((res))
    }
    signUp = async (req, res, next) => {
        console.log(`[P]::signUp::`, req.body);
        new CREATED({
            message: 'registered',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send((res))
    }
}

module.exports = new AccessController()