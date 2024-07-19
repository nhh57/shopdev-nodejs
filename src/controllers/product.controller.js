"use strict";

const ProductService = require('../services/product.service')
const {CREATED, SuccessResponse} = require("../core/success.response");

class ProductController {

    createProduct = async (req, res, next) => {
        console.log(`createProduct-data::${req.body}`)
        new SuccessResponse({
            message: "Create new product success!",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send((res))
    }

}

module.exports = new ProductController()