const mongoose=require("mongoose");
const Schema= mongoose.Schema;

const TokenSchema=new Schema({
    _userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'auth_detail'
    },
    token:{
        type:String,
        required:true
    }
});

const TokenModel=new mongoose.model("token_detail",TokenSchema)
module.exports=TokenModel;