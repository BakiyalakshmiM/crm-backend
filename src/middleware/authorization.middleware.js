const JWT = require("jsonwebtoken");
require("dotenv").config();
const { getJWT, deleteJWT} = require("../helper/redis.helper")
const userAuthorization = async ( req, res, next) => {
    try{
        let { authorization} = req.headers;

        if(!authorization){
            return res.status(500).send({ error: 'JWT not provided'})
        }
        const decoded = JWT.verify( authorization, process.env.JWT_ACCESS_TOKEN )

        if(!decoded.email){
            return res.status(500).send({ error: 'Invalid JWT'})
        }

        const userId = await getJWT( authorization);

        if(!userId){
            return res.status(403).json({ message: 'JWT not found'})
        }
        req.userId = userId;
        next();


    } catch(err){
        console.log(err)
        if(err.message == 'jwt expired'){
            deleteJWT(req.headers.authorization)
        }
        res.status(403).json({ message: 'Forbidden', error: err})
    }
}

module.exports = {
    userAuthorization
}