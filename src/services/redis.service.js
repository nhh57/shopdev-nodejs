'use strict'

const redis = require('redis')
const redisClient = redis.createClient()
const {promisify} = require('util')
const {reservationInventory} = require("../repository/inventory.repo");
const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setNXAsync = promisify(redisClient.setNX).bind(redisClient)


const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam lock
    for (let i = 0; i < retryTimes.length; i++) {
        // tao 1 key, thang nao nam giu duoc vao thanh toan
        const result = await setNXAsync(key, expireTime)
        console.log(`result:::`, result) // chua ai giu thi = 1 => cap cho nguoi khac, giu roi thi =0
        if (result === 1) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime)
                return key
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}


module.exports = {
    acquireLock,
    releaseLock
}