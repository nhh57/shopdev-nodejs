'use strict'

const KeyTokenService = require('../services/keyToken.service')
const {createTokenPair, verifyJWT} = require('../auth/auth.Utils')
const shopModel = require('../models/shop.model')
const {getInfoData} = require('../utils/index')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {BadRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'

}

class AccessService {
    static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken}) => {
        console.log('start -- service -- handlerRefreshTokenV2')
        const {userId, email} = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened !! Pls relogin')
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')
        //check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not registered 2')
        // tao 1 cap moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
        // cap nhat token
        await keyStore.updateOne( {
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi
            }
        })
        return {
            user,
            tokens
        }
    }

    /*
    1 check this token used?
    */
    static handlerRefreshToken = async (refreshToken) => {
        // kieemr tra token da su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            // decode xem thong tin user
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email})
            // xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened !! Pls relogin')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registered 1')
        // verifyToken
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]::--', {userId, email})
        //check userId
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not registered 2')

        // tao 1 cap moi
        const tokens = await createTokenPair({userId, email},
            holderToken.publicKey, holderToken.privateKey)
        // cap nhat token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken

            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da dc su dung de lay token moi
            }
        })
        return {
            userId: {userId, email},
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(`delKey ${delKey}`)
        return delKey
    }
    /*
   1 - check email in dbs
   2 - match password
   3 - create AT vs RT and save
   4 - generate tokens
   5 - get data return login
    * */
    static login = async ({email, password, refreshToken = null}) => {
        console.log("login:: email %s :: password %s :: refreshToken %s", email, password, refreshToken)
        //1.
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Shop not registered!')
        //2.
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')
        //3.
        // create privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4. generate tokens
        const {_id: userId} = foundShop

        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,

        })
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }


    static signUp = async ({name, email, password}) => {
        console.log("signUp:: name %s :: email %s :: password %s", name, email, password)
        // try {
        // b1 check mail exists??
        const holderShop = await shopModel.findOne({email}).lean()
        console.log('holderShop::', holderShop)
        if (holderShop) {
            throw new BadRequestError('Error Shop already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
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

            console.log({privateKey, publicKey}) //save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError('KeyStore Error')
                // return {
                //     code :'xxxx',
                //     message :'keyStore error'
                // }
            }
            // create token pair
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
            console.log(`Created Tokens Success::`, tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'], object: newShop
                    }),
                    tokens
                }
            }
            // const tokens = await
        }

        return {
            code: 200,
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