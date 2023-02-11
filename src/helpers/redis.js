const  redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL);

(async () => {
    await client.connect();
    console.log("redis connected!")
})();

client.on('ready', () => {
    console.log("Connected!");
});

client.on('error', (err) => {
    console.error(err);
});

const setKey = async (key, value) =>{
    try{
        await client.set(key,value)
    }catch(err){
        console.log(err)
        throw err
    }
}

const getKey = async(key) =>{
    try{
        return await client.get(key)
    }catch(err){
        console.log(err)
        throw err
    }
}

const deleteKey = async(key) =>{
    try{
        await client.del(key)
    }catch(err){
        console.log(err)
        throw err
    }
}


module.exports={
    setKey,
    getKey,
    deleteKey
}