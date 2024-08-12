'use strict'
const {product, clothing, electronic,furniture} = require('../models/product.model')
const {BadRequestError} = require("../core/error.response");

//define Factory class to create product
class ProductFactory {
    /*
    type : ""
    */
    static async createProduct(type, payload) {
        console.log()
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Furniture':
                return new Furniture(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types:: ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
                    product_name, product_thumb, product_description, product_price,
                    product_type, product_shop, product_attributes, product_quantity
                }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({...this, _id:product_id})
    }
}

// define sub-class for different product type Clothing
class Clothing extends Product {
    async createProduct() {
        console.log('createProduct Clothing')
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
}

// define sub-class for different product type Electronic
class Electronic  extends  Product {
    async createProduct() {
        console.log('createProduct Electronic')
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        console.log(`newElectronic:: ${newElectronic}`)
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
}

module.exports = ProductFactory