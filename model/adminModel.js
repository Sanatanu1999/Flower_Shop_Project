const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const adminSchema = new Schema({
    product_name: {type: String, required: true},
    product_description: {type: String, required: true},
    product_price: {type: Number, required: true},
    product_catagory:{type:String, required:true},
    product_image: {type: String, required: false},
},
{
    timestamps: true,
    versionKey:false
})
const adminModel=new mongoose.model("admin_detail",adminSchema);
module.exports=adminModel;