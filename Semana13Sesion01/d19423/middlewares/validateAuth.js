const validateAuth = (req,res,next)=>{
    if(req.headers["x-token"]!=="secret") return res.status(401).json({error:"Requiere Autenticacion"});

    next();
}

module.exports ={
    validateAuth
}