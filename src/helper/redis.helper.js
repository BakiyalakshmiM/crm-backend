const { createClient } = require('redis');
require("dotenv").config();

let connectRedis = async ()=> {
    let client = await createClient(process.env.REDIS_URL)
  .on('error', err => console.error('Redis Client Error', err))
  .connect();

  return client
}

const saveJWT = async ( key, value)=> {
    return new Promise(async ( resolve, reject)=> {
        try{
            let client = await connectRedis();
            console.log(key, value)
            let res = client.set(key, value)
            console.log(`res.... ${ res}`)
            resolve(res)
        } catch (err) {
            reject(err)
        }
    })
}

const getJWT = async ( key)=> {
    return new Promise(async ( resolve, reject)=> {
        try{
            let client = await connectRedis();
            let res = client.get(key)
            resolve(res)
        } catch (err) {
            reject(err)
        }
    })
}

const deleteJWT = async(key)=> {
    try{
        let client = await connectRedis();
        let res = client.del(key)
        console.log(`key deleted..    ${key}`)
    } catch(err){
        console.log(err)
    }
}

module.exports = {
    saveJWT,
    getJWT,
    deleteJWT
}


