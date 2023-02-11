let express = require('express')
let app = express()
let PORT = process.env.PORT || 4000  
let bodyParser = require('body-parser')
let mongoose = require('mongoose')

require('dotenv').config()
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

let userRouter = require('./src/routes/user.routes')
let ticketRouter = require('./src/routes/ticket.routes')
let tokenRouter = require('./src/routes/token.routes')
const cors = require('cors')
//errorhandler
const handleError = require('./src/utils/errorHandler')

app.use(cors())

app.use('/v1/user',userRouter)

app.use('/v1/ticket',ticketRouter)

app.use('/v1/token',tokenRouter)

app.get('/*',(req,res,next)=>{
    let error = new Error("No route found!")
    error.status = 404
    next(error)
})

app.use((error,req,res,next)=>{
    handleError(error,res)
})

async function main() {
    try{
        if(process.env.NODE_ENV !== 'production'){
          await mongoose.connect( process.env.MONGO_URI ||'mongodb://localhost:27017/crm-system',{

          useNewUrlParser: true, 
          
          useUnifiedTopology: true 
          
          }, err => {
            if(err) throw err;
            console.log('Connected to MongoDB!!!')
            });
        }
    }
    catch(Err){
        console.log(Err)
        throw Err
    }
}

main().catch(Err=>{
    console.log("something went wrong",Err)
})

// mongoose.connect( process.env.MONGO_URI ||'mongodb://localhost:27017/crm-system')
// .then(() => console.log('Connected!')).catch(Err=>{
//     console.log(Err,"juhgf")
// });

app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("listening on port ",PORT)
    }
})