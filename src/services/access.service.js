'use strict'

const { status } = require("express/lib/response")
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'

}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            // b1 check mail exists??
            const holderShop = await shopModel.findOne({ email }).lean()
            console.log('holderShop::', holderShop)
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                // created privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    moduluslength: 4096
                })
                console.log({ privateKey, publicKey }) //save collection KeyStore
            }

        } catch (error) {
            return {
                code: 'XXX',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService