const handleError = (error,res)=>{
    console.log(error)
    let status = error.status
    res.status(status || 500).json({
        msg:error.message,
        error: true
    })
}

module.exports = handleError