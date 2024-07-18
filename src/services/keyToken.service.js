'use strict'
const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')





class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey,refreshToken}) => {
        try {
            // lv 0
            // const tokens = await keytokenModel.create({
            //     userId: userId,
            //     publicKey,
            //     privateKey
            // })

            //return tokens ? tokens.publicKey : null

            // lv xxx
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {new: true, upsert: true}

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    static removeKeyById = async (id) =>{
        return await keytokenModel.deleteOne( id )
    }
}

module.exports = KeyTokenService