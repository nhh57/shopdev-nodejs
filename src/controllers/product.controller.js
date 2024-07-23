"use strict";

const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const {CREATED, SuccessResponse} = require("../core/success.response");

class ProductController {

    // createProduct = async (req, res, next) => {
    //     console.log(`createProduct-data::${req.body}`)
    //     new SuccessResponse({
    //         message: "Create new product success!",
    //         metadata: await ProductServiceV2.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send((res))
    // }

    createProduct = async (req, res, next) => {

        console.log(`createProduct-data::${req.body}`)
        new SuccessResponse({
            message: "Create new product success!",
            metadata: await ProductServiceV2.ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send((res))
    }


    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "update Product success!",
            metadata: await ProductServiceV2.ProductFactory.updateProduct(req.body.product_type, req.params.productId,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send((res))
    }

    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Drafts",
            metadata: await ProductServiceV2.ProductFactory.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get All Published",
            metadata: await ProductServiceV2.ProductFactory.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Product By Shop Success!",
            metadata: await ProductServiceV2.ProductFactory.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Product By Shop Success!",
            metadata: await ProductServiceV2.ProductFactory.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }


    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "get List Search Publish Products Success!",
            metadata: await ProductServiceV2.ProductFactory.getListSearchProducts(
            req.params
            )
        }).send(res)
    }
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "get findAllProducts Success!",
            metadata: await ProductServiceV2.ProductFactory.findAllProducts(req.query)
        }).send(res)
    }

    findProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "get findProduct Success!",
            metadata: await ProductServiceV2.ProductFactory.findProduct({
                product_id:req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController()