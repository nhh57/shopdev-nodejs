'use strict'
const {cart} = require("../models/cart.model")
const {BadRequestError, NotFoundError} = require("../core/error.response")
const {convertToObjectIdMongodb} = require("../utils")
const {gerProductById} = require("../repository/product.repo");


/*
Key features : Cart Service
- add product to cart [user]
- reduce product quantity by one [user]
- increase product quantity by one [user]
- get cart [user]
- delete cart [user]
- delete cart item [user]
*/
class CartService {

    static async createUserCart({userId, product}) {
        const query = {cart_userId: userId, cart_state: 'active'},
            updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = {upsert: true, new: true}
        console.log(`qury::${query}`)
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}) {
        const {productId, quantity} = product;
        console.log("{productId, quantity}",{productId, quantity})
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = {upsert: true, new: true}
        console.log(`query::${JSON.stringify(query)}`)
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        // check cart ton tai hay khong?
        const userCart = await cart.findOne({cart_userId: userId})
        if (!userCart) {
            // create cart for user
            console.log(`=>>> create cart :: ${JSON.stringify(userId,product)}`)
            return await CartService.createUserCart({userId, product})
        }

        // neu co gio hang roi nhung chua co san pham?
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        // gio hang ton tai , va co san pham nay thi update quantity
        return await CartService.updateUserCartQuantity({userId, product})
    }

    //update cart
    /*
    shop_order_ids:[
        {
            shopId,
            item_products: [
                {
                quantity,
                price,
                shopId,
                old_quantity:,
                productId
                }
            ],
            version
        }
    ]

    */
    static async addToCartV2({userId, shop_order_ids }) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        console.log('{productId, quantity, old_quantity}',{productId, quantity, old_quantity})
        // check product
        const foundProduct = await gerProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not exist')
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Product do not belong to the shop')
        if (quantity === 0) {
            //deleted
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }


    static async deleteUserCart({userId, productId}) {
        const query = {cart_state: 'active', cart_userId: userId,},
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({userId}) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService
