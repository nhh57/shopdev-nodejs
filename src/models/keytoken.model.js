'use strict'

const {model, Schema, Types} = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

var keyTokenSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Shop',
        },
        publicKey: {
            type: String, require: true
        },
        privateKey: {
            type: String, require: true
        },

        refreshTokenUsed: {
            type: Array,
            default: [] // nhung RT da dc su dung
        },

        refreshToken: {
            type: String,
            require: true
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
);
module.exports = model(DOCUMENT_NAME, keyTokenSchema);