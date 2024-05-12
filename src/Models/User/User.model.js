const { UserSchema} = require('./User.schema');

const insertUser = async (userObj) => {
        return new Promise( async(resolve, reject)=> {
            try{
                let data = await UserSchema(userObj).save();
                resolve(data)
            }
            catch (err){
                console.log(err)
                reject(err);
            }
        })        
}

const updatePassword = async( email, pin, password)=> {
    return new Promise(async( resolve, reject)=> {
        try{
            let data = await UserSchema.findOne({email});
            data.password = password;
            let updatedData = await data.save();
            resolve(updatedData);
        } catch (err){
            console.log(err)
            reject(err);
        }
    })
}

const getUserById = async(_id)=>{
    return new Promise(async (resolve, reject)=> {
        try{
            let userDetail = await UserSchema.findOne({_id});
            console.log( `userDetail ${JSON.stringify(userDetail)}`)
            resolve(userDetail)
        } catch( err){
            console.log(err)
            reject(err)
        }
    })
}

const getUserByEmail = async( email)=> {
    return new Promise( async ( resolve, reject)=> {
        try{
            let userDetail = await UserSchema.findOne({ email});
            resolve(userDetail)
        } catch( err){
            console.log(err)
            reject(err)
        }
    })
}

const setUserRefreshToken = async ( _id, token) => {
    console.log(_id, token)
    return new Promise(async (resolve, reject)=> {
        try{
            let data = await UserSchema.findOneAndUpdate({_id}, { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now()}, {new: true})
            resolve(data);
        } catch( err){
            reject(err)
        }
    })
}

module.exports = {
    insertUser,
    getUserById,
    getUserByEmail,
    setUserRefreshToken,
    updatePassword
}