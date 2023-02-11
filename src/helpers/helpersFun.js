const bcrypt = require("bcrypt")
let JWT = require('jsonwebtoken');
const { setKey } = require("./redis");

const hashPassword = (password) => {
    const saltRounds = 10;

    return new Promise((resolve, reject) => {

        resolve(bcrypt.hashSync(password, saltRounds))
    })
}

const checkPass = async (password, hashPass) => {

    const match = await bcrypt.compare(password, hashPass);

    if (match) {
        return true
    }
    return false
}

const createJWT = async (payload,exp = '1d') => {
    let token = await JWT.sign(payload,process.env.JWT_SECRET,{ expiresIn: exp })
    await setKey(token,`${payload.id}`)
    return token;
} 

const createRefreshJWT = async (payload ) => {
    let token = await JWT.sign(payload,process.env.JWT_REFRESH_SECRET,{ expiresIn: process.env.JWT_REFRESH_SECRET_EXP_DAY+'d' })
    return token;
} 

const verifyJwt = async (token) =>{
    try{
        let x = await JWT.verify(token,process.env.JWT_SECRET)
        return x
    }catch(err){
        console.log(err.message)
        throw err
    }
}

const verifyRefreshJwt = async (token) =>{
    try{
        let x = await JWT.verify(token,process.env.JWT_REFRESH_SECRET)
        return x
    }catch(err){
        console.log(err.message)
        throw err
    }
}


const randomPinNumber = (length) => {
    let pin = "";
  
    for (let i = 0; i < length; i++) {
      pin += Math.floor(Math.random() * 10);
    }
  
    return pin;
  };


module.exports = {
    hashPassword,
    checkPass,
    createJWT,
    verifyJwt,
    createRefreshJWT,
    verifyRefreshJwt,
    randomPinNumber
}