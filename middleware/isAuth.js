const jwt=require('jsonwebtoken')

class Authjwt{
    async authjwt(req,res,next){
        try{
            if(req.cookies&&req.cookies.token_data){
                jwt.verify(req.cookies.token_data,process.env.SECRET_KEY,(err,data)=>{
                    console.log("token verify",data);
                    req.user=data
                    next()
                })
            }else{
                next()
            }
        }catch(err)
        {
            console.log("error to verify token",err);
        }
    }
}
module.exports=new Authjwt( )