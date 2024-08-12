'use strict';

const {SuccessResponse} = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Discount Code Create',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res)
    }


    getDiscountAmount = async (req, res, next) => {
        console.log(`getDiscountAmount params::${ JSON.stringify(req.body) }`);
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }


    getAllDiscountCodeWithProducts = async (req, res, next) => {
        console.log(`getAllDiscountCodeWithProducts param :: ${JSON.stringify(req.query)}`)
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

}

module.exports = new DiscountController()
