'use strict';
const {inventory} = require("../models/inventory.model");
const {Types} = require("mongoose");
const insertInventory = async ({
                                   productId,
                                   shopId,
                                   stock,
                                   location = 'unKnow'
                               }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        location: location,
        inven_shopId: shopId,
    })
}




module.exports={
    insertInventory,
}