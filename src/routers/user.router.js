
const express = require("express");
const router = express.Router();
const { insertUser, getUserById, getUserByEmail, setUserRefreshToken, updatePassword} = require('../Models/User/User.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { saveJWT, getJWT} = require("../helper/redis.helper")
const { userAuthorization} = require("../middleware/authorization.middleware")
const { setPasswordResetPin, getPinByEmailPin, deletePin} = require("../Models/ResetPin/ResetPin.model")
const { emailProcessor} = require("../helper/email.helper")
const { deleteJWT} = require("../helper/redis.helper")

router.get('/', userAuthorization, async( req, res)=> {
    try{
        console.log(`req ${req.userId}`)

        const userProf = await getUserById(req.userId);
        if(!userProf){
            res.status(404).json({ message: `User Not Found`})
        }
        const { _id,name, email} = userProf;
        res.status(200).json({ user: { _id, name, email}});
    } catch(err){
        console.log(`err... ${err}`)
        res.status(500).json({ message: err.message})
    }
})

router.post('/', async (req, res) => {
    try {
        // const hashedPassword = await hashPassword(password);

        let result = await insertUser({ ...req.body });
        res.json({ result })
    } catch (error) {
        res.status(500).json({ "error": error.message })
    }

})

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(500).json({ message: "Email & Password is required" })
        }

        let user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Email not found" })
        }

        const userPassword = user.password

        let bcryptPassword = await bcrypt.compare(password, userPassword)

        if (!bcryptPassword) {
            return res.status(500).json({ message: "Password is incorrect" })
        }

        let accessJWT = jwt.sign( { email}, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: '1h'
        })

        let refreshJWT = jwt.sign( { email}, process.env.JWT_SECRET_TOKEN,{
            expiresIn: '30m'
        })

        await saveJWT( accessJWT, `${user._id}`)
        console.log(`Saaved`)
        await setUserRefreshToken( user._id, refreshJWT)
        console.log(`accessToken ${accessJWT}.... ${refreshJWT}`)
        return res.status(200).json({ message: "Logged In Successfully", 
        user,
         accessJWT, refreshJWT })
    } catch (err){
        return res.status(500).json({error: err})
    }

})

router.post('/reset-password', async ( req, res)=> {
    try{
        let { email} = req.body;
        if(!email){
            return res.status(500).json({ message: "Email is mandatory"})
        }
        let user = await getUserByEmail(email)

        if(!user){
            return res.status(500).json({ message: "Email not Registered "})
        }

        let setPin = await setPasswordResetPin(email);

        let result = await emailProcessor( email, setPin.pin, "reset_password")

        if(!result || !result?.messageId){
            return res.status(500).json({ message: "Unable to send pin. Please try again later"})
        }

        return res.status(200).json({ message: "The password reset pin will be sent to email shortly"})

    } catch ( err){
        return res.status(500).json({ message:`Error in sending OTP ${err}`})
    }
})

router.patch('/reset-password', async ( req, res)=> {
    try{
        const { email, pin, newPassword} = req.body;
        if(!email){
            return res.status(500).json({ message:`Email is Mandatory`})
        }
        if(!pin){
            return res.status(500).json({ message:`Pin is Mandatory`})
        }
        if(!newPassword || newPassword.length < 6){
            return res.status(500).json({ message:`Password is Mandatory & it should be atleast 6 characters length`})
        }
        let response = await getPinByEmailPin( email, pin);

        if(!response){
            return res.status(500).json({ message:`OTP is incorrect`})
        }

        const dbDate = response.addedAt;
        let expiresIn = 1
        const expiredDate = dbDate.setDate( dbDate.getDate() + expiresIn)

        if( new Date > expiredDate){
            return res.status(500).json({ message:`Expired Pin`})
        }

        let userResponse = await updatePassword( email, pin, newPassword);

        await emailProcessor( email, pin, "updated_password")

        await deletePin( email, pin)

        return res.status(200).json({ message:`Password Updated Successfully.`, userResponse})

    } catch ( err){
        return res.status(500).json({ message:`Error in sending OTP ${err}`})
    }
})

router.delete('/logout', userAuthorization, async( req, res)=> {
    try{
        console.log(`req ${req.userId}`)

        const {authorization} = req.headers;

        console.log(`author ${ authorization}`)
        const _id = req.userId;
        await  deleteJWT(authorization)
        const result = await setUserRefreshToken( _id, '')
        res.status(200).json({ result});
    } catch(err){
        console.log(`err... ${err}`)
        res.status(500).json({ message: err.message})
    }
})

module.exports = router;