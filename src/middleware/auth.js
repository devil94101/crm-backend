const { verifyJwt } = require("../helpers/helpersFun");
const { getKey, deleteKey } = require("../helpers/redis");

const authGaurd = async (req,res,next)=>{
    let token = req.headers['auth-token'];
    // console.log(req.headers)
    let error ;
    if(!token){
        error = new Error('No token found!')
        error.status = 400
        return next(error)
    }
    try{
        let userDetails = await verifyJwt(token)
        if(userDetails.id){
            // let userId = await getKey(token)
            req.headers.userId = userDetails.id
            return next()
        }
        deleteKey(token)
        error = new Error('Invalid Token')
        error.status = 400
        return next(error)
    }catch(err){
        console.log(err.message)
        error = new Error('Invalid token')
        error.status = 400
        return next(error)
    }

}

module.exports = {
    authGaurd
}