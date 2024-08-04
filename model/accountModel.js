const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const AccountSchema=new Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contact_no:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
})

const AccountModel=new mongoose.model("account_detail",AccountSchema)
module.exports=AccountModel;
