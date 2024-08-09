'use strict'

const {model, Schema, Types} = require("mongoose");
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'
// ORDER-001 : order successfully
// ORDER-002 : order faild
// PROMOTION-001 : new PROMOTION
// SHOP-001 : new product by user following
// ban nhan duoc 1 voucher cua shop abc
const notificationSchema = new Schema({
    noti_type: {type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true},
    noti_senderId: {type: Schema.Types.ObjectId, required: true,ref:'Shop'},
    noti_receivedId: {type: Number, required: true},
    noti_content: {type: String, default: {}},
    noti_options: {type: Object, default: {}},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}