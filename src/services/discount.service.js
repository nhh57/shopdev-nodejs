'use strict';

/*
Discount Service
1. Generator discount code [Shop | Admin]
2. Get discount code amount [User]
3. Get all discount codes [User| Shop]
4. Verify discount code [User]
5. Delete discount code [Admin | Shop]
6. Cancel discount code [User]
*/
const {BadRequestError, NotFoundError} = require("../core/error.response");
const discount = require('../models/discount.model')
const product = require('../models/product.model')
const {convertToObjectIdMongodb} = require("../utils");
const {findAllProducts} = require("../repository/product.repo");
const {findAllDiscountCodesUnSelect, checkDiscountExists} = require("../repository/discount.repo");

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
        } = payload
        // kiểm tra
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expired!')
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date!')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        return await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

    }

    static async updateDiscountCode() {

    }

    /*
     Get all discount codes with products
    */
    static async getAllDiscountCodesWithProduct({code, shopId, userId, limit, page}) {
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()
        console.log(`foundDiscount::${foundDiscount}`)
        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError('Discount not exists')

        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get all  product
            products = await findAllProducts({

                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            // get all  product ids
            products = await findAllProducts({

                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products;
    }

    /*
     Get all discount code of shop
    */
    static async getAllDiscountCodesByShop({limit, page, shopId}) {
        return await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount,
        })
    }

    /*
    Apply Discount Code
    product :[
        {
            productId,
            shopId,
            quantity,
            name,
            price
        },
        {
            productId,
            shopId,
            quantity,
            name,
            price
        }
    ]
   */
    static async getDiscountAmount({codeId, userId, shopId, products}) {

        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },

        })
        if (!foundDiscount) throw new NotFoundError('Discount not exists')
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_start_date,
            discount_end_date,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('Discount expired!')
        if (!discount_max_uses) throw new NotFoundError('Discount are out!')
        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new NotFoundError('Discount code has expired !')


        // check xem co set gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            console.log(`==========> products::${JSON.stringify(products)}`)
            // get total
            totalOrder = products.reduce((total, product) => {
                return total + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}!`)
        }
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUserDiscount) {
                //....
            }
        }
        // check xem discount nay la fixed_amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({codeId, shopId}) {
        // kiem tra cos ai dang su dung hay khong hoac co su dung o gio hang nao hay khong
        const deleted = await discount.findOne({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId),
        })
        return deleted
    }

    /*
    cancelDiscountCode
   */
    static async cancelDiscountCode({shopId, codeId, userId}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount not exists!')

        return await foundDiscount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
    }

}


module.exports = DiscountService














