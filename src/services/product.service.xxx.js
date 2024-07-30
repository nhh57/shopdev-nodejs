'use strict'
const {
    product,
    clothing,
    electronic,
    furniture
} = require('../models/product.model')
const {BadRequestError} = require("../core/error.response");
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProductById,

} = require("../repository/product.repo");
const {removeUndefinedObject, updateNestedObjectParser} = require("../utils");
const {insertInventory} = require("../repository/inventory.repo");

//define Factory class to create product
class ProductFactory {

    static productRegistry = {} //key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }


    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type:: ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        console.log('======================> product.service.xxx -- updateProduct -- type:: %s \nproductId:: %s \npayload:: %s', type, productId, payload.product_attributes)
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type:: ${type}`)
        return new productClass(payload).updateProduct(productId)
    }

    // PUTw

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }

    // query
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async getListSearchProducts({keySearch}) {
        return await searchProducts({keySearch})
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {

        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['product_name', 'product_price', 'product_thumb','product_shop']
        })
    }


    static async findProduct({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_ratingsAverage']})
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
        const newProduct = await product.create({...this, _id: product_id})
        if (newProduct) {
// add Product stack in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct
    }

    //update Product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({productId, bodyUpdate, model: product})
    }
}

// define sub-class for different product type Clothing
class Clothing extends Product {
    async createProduct() {
        console.log('createProduct Clothing')
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }

    async updateProduct(productId) {
        console.log('======================> updateProduct Clothing productId:: %s', productId)

        // 1.remove attr has null undefined
        const objParam = removeUndefinedObject(this)

        // 2. check xem update o dau
        if (objParam.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objParam.product_attributes),
                model: clothing
            })
        }

        return await super.updateProduct(productId, updateNestedObjectParser(objParam))
    }
}

// define sub-class for different product type Electronic
class Electronics extends Product {
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

class Furniture extends Product {
    async createProduct() {
        console.log('createProduct Furniture')
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error')
        return newProduct
    }
}


// register product type
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = {
    ProductFactory,
}