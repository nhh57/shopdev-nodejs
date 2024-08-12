'use strict';

const {SuccessResponse} = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        console.log('checkoutReview - req.body::',JSON.stringify(req.body))
        new SuccessResponse({
            message: 'checkout Review success',
            metadata: await CheckoutService.checkoutReview( req.body )
        }).send(res)
    }


}

module.exports = new CheckoutController()