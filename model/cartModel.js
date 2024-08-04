const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const cartSchema = new Schema({
    productId:{type:String,required:true},
    quantity:{type:Number,required:true},
    userId:{type:String,required:true},
    cart:[{type:Object,required:true}],

    
},
{
    timestamps: true,
    versionKey:false
})
const cartModel=new mongoose.model("cart_detail",cartSchema);
module.exports=cartModel;