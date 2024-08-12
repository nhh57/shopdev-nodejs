'use strict';

const {SuccessResponse} = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Stock To Inventory Success',
            metadata: await InventoryService.addStockToInventory({
                ...req.body,
                productId: req.body.shopId,
                shopId: req.user.userId,
            })
        }).send(res)
    }


}

module.exports = new InventoryController()
