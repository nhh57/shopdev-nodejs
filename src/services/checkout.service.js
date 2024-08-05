'use strict';


const {findCartById} = require("../repository/cart.repo");
const {NotFoundError, BadRequestError} = require("../core/error.response");
const {checkProductByServer} = require("../repository/product.repo");
const {DiscountService} = require("../services/discount.service");

class CheckoutService {

// login and without login
    /*
    {
        cartId,
        userId,
        shop_order_ids:[
            {
                shopId,
                shop_discount:[],
                item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discount:[
                {
                    "shopId",
                    "discountId",
                    "codeId"
                }
                ],
                item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
     */


    static async checkoutReview({cartId, userId, shop_order_ids}) {

        // check cartId tồn tại không?
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new NotFoundError('Cart does not exists!')

        const checkout_order = {
            totalPrice: 0, // tổng tiền hàng
            feeShip: 0, //Phí vận chuyển
            totalDiscount: 0, // tổng tiền discount giảm giá
            totalCheckout: 0, // tổng thanh toán
        }, shop_order_ids_new = []
        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discount = [], item_products = []} = shop_order_ids[i]
            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong !!!')

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discount ton tai >0 check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount
                const {totalPrice = o, discount = 0} = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}


module.exports = CheckoutService