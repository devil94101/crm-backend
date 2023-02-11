const {userSchema} = require('./user.schema')

const insertUser =async (userObj ) =>{
    try{
        await userSchema(userObj).save()
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }

}

const deleteAllUsers =async ( ) =>{
    try{
        await userSchema.deleteMany()
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }

}

const getAllUsers = async () =>{
    try{
        let users = await userSchema.find()
        return users
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }
} 

const getUserByEmail = async (email) =>{
    try{
        let user = await userSchema.findOne({
            email
        })
        return user
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }
}

const getUserById = async (id) =>{
    try{
        let user = await userSchema.findById(id)
        return user
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }
}


const saveRefreshToken = async(_id,token)=>{
    try{
        let res = await userSchema.findByIdAndUpdate(_id,{
            refreshJWT:{
                token,
                addedAt: Date.now()
            }
        })
        return res
    }
    catch(Err){
        let error = new Error(Err.message)
        error.status = 400;
        throw error
    }
}

const updatePassword = (email, newhashedPass) => {
    return new Promise((resolve, reject) => {
      try {
        userSchema.findOneAndUpdate(
          { email },
          {
            $set: { password: newhashedPass },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

module.exports = {
    insertUser,
    deleteAllUsers,
    getUserByEmail,
    getAllUsers,
    saveRefreshToken,
    getUserById,
    updatePassword
}