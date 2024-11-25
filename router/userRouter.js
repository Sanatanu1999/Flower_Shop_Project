const express=require('express')
const route=express.Router()
const {getSignUpForm,postSignUpForm,getSignInForm,mailConfirm,postSignInForm,userAuth,cardUserProduct,getContactdetail,post_add_to_cart,viewAddToCard,post_contact,order_placed,quantityAdd,quantitySubs,deleteOrder,viewProfile,viewProfileEdit,editProfilePost,deleteProfile,getEmailForgotPass,postEmailForgotPass,PasswordCreatePage,getForgotPass,postForgetPass,logout}=require('../controller/userController')
const authMiddleware=require('../middleware/isAuth')





route.get('/',getSignUpForm)
route.post('/postSignUp',postSignUpForm)
route.get('/sign-in',getSignInForm)
route.post('/postSignIn',postSignInForm)
route.get('/mail_confirmation/:email/:token',mailConfirm)
// route.get('/webpage_design',authMiddleware.authjwt,userAuth,web_page)
route.get('/user/cardprod',authMiddleware.authjwt,userAuth,cardUserProduct);
route.post('/addTocart',authMiddleware.authjwt,userAuth,post_add_to_cart)
route.get('/user/viewAddToCard',authMiddleware.authjwt,userAuth,viewAddToCard)
route.get('/changeQntyAdd/:cart_id',authMiddleware.authjwt,userAuth,quantityAdd)
route.get('/changeQntySub/:cart_id',authMiddleware.authjwt,userAuth,quantitySubs)
route.get('/user/contact',authMiddleware.authjwt,userAuth,getContactdetail)
route.post('/postContact',post_contact)
route.get('/place_order',authMiddleware.authjwt,userAuth,order_placed,deleteOrder)
route.get('/user/profile',authMiddleware.authjwt,userAuth,viewProfile)
route.get('/user/viewProfileEdit/:pid',authMiddleware.authjwt,userAuth,viewProfileEdit)
route.post('/user/editPost',authMiddleware.authjwt,userAuth,editProfilePost)
route.get('/user/deleteProfile/:id',authMiddleware.authjwt,userAuth,deleteProfile)
route.get('/getEmailForgotPas',getEmailForgotPass)
route.post('/postEmailForgotPas',postEmailForgotPass)
route.get('/reset_password/:email',PasswordCreatePage)
route.get('/getEmailForgotPas',getForgotPass)
route.post('/postForgetPass',postForgetPass)
route.get('/logout',logout);



module.exports=route;