'use strict';

const {
    inventory
} = require('../models/inventory.model')

const {
    getProductById
} = require('../models/product.model')
const {BadRequestError} = require("../core/error.response");

class InventoryService {
    static async addStockToInventory({
                                         stock,
                                         productId,
                                         shopId,
                                         location = '123, Tran Phu, HCM city'
                                     }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product does not exists!')
        const query = {inven_shopId: shopId, inven_productId: productId},
            updateSet = {
                $inc: {
                    inven_stock: stock
                },
                $set: {
                    inven_location: location
                }
            }, options = {upsert: true, new: true}
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService