const errorMiddleWare = (err,req,res,next)=>{
  err.message = err.message || "Internal Server Error"
  err.statusCode = err.statusCode || 500

  return res.status(err.statusCode).json({
    success:false,
    message:err.message,
    statusCode:err.statusCode
  })
}


const TryCatch = (passedFunction)=>async(req,res,next)=>{
  try{
    await passedFunction(req,res,next)
  }
  catch(error){
    next(error)
  }
}



export {errorMiddleWare,TryCatch}
