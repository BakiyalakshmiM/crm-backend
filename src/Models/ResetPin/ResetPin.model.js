const { ResetPinSchema} = require('./ResetPin.schema');
const { randomPinGenerator} = require("../../utility/randomGenerator")

const setPasswordResetPin = async (email) => {
        return new Promise( async(resolve, reject)=> {
            try{
                const randPin = randomPinGenerator()
                console.log(`randomPin ${ randPin}`)
                const resetObj = {
                    email,
                    pin: randPin
                }
                let data = await ResetPinSchema(resetObj).save();
                resolve(data)
            }
            catch (err){
                console.log(err)
                reject(err);
            }
        })        
}

const getPinByEmailPin = async ( email, pin)=> {
    return new Promise(async ( resolve, reject)=>{
        try{
            let data = await ResetPinSchema.findOne({ email, pin});
            resolve(data)
        } catch (err){
            console.log(err)
            reject(err);
        }
    })
}

const deletePin = async( email, pin)=>{
    return new Promise(async ( resolve, reject)=> {
        try{
            await ResetPinSchema.findOneAndDelete({ email, pin})
            console.log(`Deleted`)
            resolve()
        } catch( err){
            console.log(err)
            reject(err);
        }
    })
}

module.exports = {
    setPasswordResetPin,
    getPinByEmailPin,
    deletePin
}