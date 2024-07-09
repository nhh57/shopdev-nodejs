'use strict'

const KeyTokenService = require('../services/keyToken.service')
const {createTokenPair} = require('../auth/auth.Utils')
const shopModel = require('../models/shop.model')
const {getInfoData} = require('../utils/index')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {BadRequestError} = require("../core/error.response");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'

}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        console.log("signUp:: name %s :: email %s :: password %s",name,email,password)
        // try {
            // b1 check mail exists??
            const holderShop = await shopModel.findOne({ email }).lean()
            console.log('holderShop::', holderShop)
            if (holderShop) {
                 throw new BadRequestError('Error Shop already registered!')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email,  password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {

                // created privateKey, publicKey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding :{
                //         type : 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding :{
                //         type : 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({ privateKey, publicKey }) //save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore){
                    throw new BadRequestError('KeyStore Error')
                    // return {
                    //     code :'xxxx',
                    //     message :'keyStore error'
                    // }
                }
                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey,privateKey)
                console.log(`Created Tokens Success::`,tokens)
                return {
                    code: 201,
                    metadata:{
                        shop : getInfoData({
                            fields:['_id','name','email'],object: newShop}),
                        tokens
                    }
                }
                // const tokens = await
            }

            return {
                code : 200,
                metadata: null
            }

        // } catch (error) {
        //     console.error(error)
        //     return {
        //         code: 'XXX',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService