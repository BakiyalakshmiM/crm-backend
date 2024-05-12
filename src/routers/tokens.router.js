const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const { getUserByEmail} = require("../Models/User/User.model")
const { saveJWT, deleteJWT} = require("../helper/redis.helper")

router.get('/', async( req, res, next)=> {
    try{
        const {authorization} = req.headers
        if(!authorization){
           return res.status(500).json({ message: 'Refresh JWT Not Provided'})
        }

        let decoded = JWT.verify( authorization, process.env.JWT_SECRET_TOKEN);

        if( decoded.email){
            const userProf = await getUserByEmail(decoded.email)

            if(!userProf){
                return res.status(500).json({ message: 'User Not Found'});
            }

            const dbRefreshToken = userProf.refreshJWT.token

            if(dbRefreshToken != authorization){
                return res.status(500).json({ message: 'Invalid Refresh Token'})
            }
            let accessJWT = JWT.sign( {email: decoded.email}, process.env.JWT_ACCESS_TOKEN,{
                expiresIn: '1h'
            })

            await saveJWT( accessJWT, `${userProf._id}`)


            return res.status(200).json({ message: "Token", accessJWT})
        }
    } catch( err){
        return res.status(500).json({ message: err.message})
    }
    
})
module.exports = router;