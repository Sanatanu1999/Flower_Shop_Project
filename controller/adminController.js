const adminModel=require('../model/adminModel')
const fs=require('fs')
const path=require('path')

const addProductForm=(req,res)=>{
    res.render('admin/addProduct',{
        title:"add form"
    })
}
const postData=async(req,res)=>{
    try{
        console.log("collected value form add product form",req.body,req.file);
        let image=req.file.filename
        const storeData=new adminModel({
        product_name:req.body.productName,
        product_description:req.body.description,
        product_price:req.body.price,
        product_catagory:req.body.category,
        product_image:image
        })
        let saveData=await storeData.save();
        if(saveData)
        {
            console.log("product is saved");
            res.redirect('/view_product')
        }
    }catch(err){
        console.log("Data is not collected",err);
    }

}
const viewProduct=async(req,res)=>{
    try{
        let viewDetail=await adminModel.find()
        console.log("collected data from viewdetail",viewDetail);
        if(viewDetail)
        {
            res.render('admin/viewProduct',{
                title:"view product",
                data:viewDetail
            })
        }
    }catch(err){
        console.log("Data not fetched",err);
    }
}
const viewEdit=async(req,res)=>{
    try{
        let editData=req.params.Iid;
        const oldData=await adminModel.findById(editData)
        console.log("collected value from edit data:",oldData);
        if(oldData){
            res.render('admin/editProduct',{
                title:"edit form",
                data:oldData
            })
        }
    }catch(err)
    {
        console.log("data not found",err);
    }
}

const editPost=async(req,res)=>{
    try{
        console.log("collected value post edit",req.file,req.body);
        if(req.file){
            await adminModel.findByIdAndUpdate({_id:req.body.Iid},{$set:{product_name:req.body.productName,product_description:req.body.description,product_price:req.body.price,product_catagory:req.body.category,product_image:req.file.filename,}})
            // let saveData=await oldData.save()
            // console.log("after update:",oldData);
            // if(saveData){
            //     console.log("Detail is saved",saveData);
                res.redirect('/view_product');
            // }
        }
        else{
            const oldData=await adminModel.findByIdAndUpdate({_id:req.body.Iid},{$set:{product_name:req.body.productName,product_description:req.body.description,product_price:req.body.price,product_catagory:req.body.category}})
          
        }
       
    }catch(err){
        console.log("edit to error",err);
    }

}
const deleteProd=async(req,res)=>{
    try{
        let newProduct_id=req.params.id;
        let deleted=await adminModel.findOneAndDelete({_id:newProduct_id}) 
        console.log("product deleted:",deleted);
        if(deleted){
            fs.unlinkSync(path.join(__dirname,"..","uploads",deleted.product_image));
            res.redirect("/view_product")
        }

        
    }catch(err){
        console.log("error in deletion",err);
    }
    

}

module.exports={
    addProductForm,
    postData,
    viewProduct,
    viewEdit,
    editPost,
    deleteProd

}