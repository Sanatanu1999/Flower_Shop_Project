const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const contactSchema = new Schema({
    contact_name: {type: String, required: true},
    contact_email: {type: String, required: true},
    contact_number: {type: Number, required: true},
    contact_description:{type: String, required: true}
},
{
    timestamps: true,
    versionKey:false
})
const contactModel=new mongoose.model("contact_detail",contactSchema);
module.exports=contactModel;