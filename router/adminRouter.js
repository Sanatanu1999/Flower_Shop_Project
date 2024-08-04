const express=require('express')
const route=express.Router();
const{addProductForm,postData,viewProduct,viewEdit,editPost,deleteProd}=require("../controller/adminController")
const multer=require('multer')
const path=require('path')

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
    })
}
    
})

//file.mimetype==='image/jpg'
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp") 
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
    
}

const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5}
})

 const upload_type=upload.single("product_image")


route.get('/add_product',addProductForm)
route.post('/postAdd',upload_type,postData)
route.get('/view_product',viewProduct)
route.get('/editPage/:Iid',viewEdit)
route.post('/postedit',upload_type,editPost)
route.get('/admin/deleteProduct/:id',deleteProd)

module.exports=route;