const jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccessJWT = ( payload)=> {
    let secretJWT = jwt.sign( payload, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: '1h'
    })
    return secretJWT;
}

const createRefreshJWT = ( payload) => {
    let secretJWT = jwt.sign( payload, process.env.JWT_SECRET_TOKEN,{
        expiresIn: '30d'
    }
    )
    return secretJWT
}



module.exports = {
    createAccessJWT,
    createRefreshJWT
}