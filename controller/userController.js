const AccountModel = require("../model/accountModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const adminModel=require("../model/adminModel")
const cartModel=require("../model/cartModel")
const contactModel=require("../model/contactModel")
const TokenModel = require("../model/tokenModel");

const transporter = nodemailer.createTransport({
  host: "smtp",
  port: 465,
  secure: false,
  requireTLS: true,
  service: "gmail",
  auth: {
    user: "chakrabortysantanu1999@gmail.com",
    pass: "wcwn mqki zplp gqjv",
  },
});

const getSignUpForm = (req, res) => {
  let msg = req.flash("msg");
  let errMsg = req.flash("error");
  console.log("Flash msg for registration", msg, errMsg);
  let massage = msg.length > 0 ? msg[0] : null;
  let errMassage = errMsg.length > 0 ? errMsg[0] : null;
  res.render("user/sign_up", {
    title: "addForm",
    suc_msg: massage,
    error_msg: errMassage,
  });
};
const postSignUpForm = async (req, res) => {
  try {
    console.log("Collected from registration form",req.body);
    const verify_email = await AccountModel.findOne({ email: req.body.email });
    if (verify_email) {
      console.log("someone has already registered with this email id ");
      req.flash("msg", "someone has already registered with this email id ");
      res.redirect("/sign-up");
    } else {
      if (req.body.password === req.body.Cpassword) {
        let hashPassword = await bcrypt.hash(req.body.password, 12);
        let regData = new AccountModel({
          full_name: req.body.fullName,
          email: req.body.email,
          password: hashPassword,
          contact_no: req.body.phone,
          address: req.body.address,
        });
        let saveData = await regData.save();
        if (saveData) {
          console.log("Data sent to database");
          const token_jwt = jwt.sign(
            { email: req.body.lemail },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          const Token_data = new TokenModel({
            token: token_jwt,
            _userId: saveData._id,
          });
          token_saved = await Token_data.save();
          if (token_saved) {
            let mailOption = {
              from: "chakrabortysantanu1999@gmail.com",
              to: req.body.email,
              subject: "successful registration",
              text:
                "Hello" +
                ",\n\n you have successfully submited your data to be registered. please verify your account by clicking the link:\n " +
                "http://" +
                req.headers.host +
                "/mail_confirmation/" +
                req.body.email +
                "/" +
                token_jwt +
                "\n\nThank you\n",
            };
            transporter.sendMail(mailOption, function (error, info) {
              if (error) {
                // console.log("error to send mail",error);
                req.flash("error", "Failed to send mail");
                res.redirect("/sign-up");
              } else {
                // console.log("Email sent",info.response);
                req.flash(
                  "msg",
                  "please check your mail to verify user address"
                );
                res.redirect("/sign-up");
              }
            });
          }
        } else {
          res.send("password mismatch");
        }
      }
    }
  } catch (err) {
    console.log("faild register", err);
  }
};

const mailConfirm = async (req, res) => {
  try {
    console.log("recived mail from confirmation mail", req.params.email);
    let user_data = await AccountModel.findOne({ email: req.params.email });
    if (user_data.isVerified) {
      console.log("user already verified");
      //  req.flash("msg","user already Verified,go to login")
      res.redirect("/sign-up");
    } else {
      user_data.isVerified = true;
      let save_user = await user_data.save();
      if (save_user) {
        console.log("your account successfully verified");
        res.redirect("/sign-in");
      }
    }
  } catch (error) {
    console.log("mail verification error", error);
  }
};

const getSignInForm = (req, res) => {
  let errMsg=req.flash("error");
     console.log("flash msg:",errMsg);
    if(errMsg.length>0)
    {
        errMsg=errMsg[0];
    }
    else{
        errMsg=null;
    }
  res.render("user/sign_in", {
    title: "signInForm",
    errorMsg:errMsg
  });
};

const postSignInForm=async(req,res)=>{
  try{
    let existingUser=await AccountModel.findOne({email:req.body.lemail});
    if(!existingUser){
      req.flash("error","Invalid email");
      return res.redirect("/sign-in");
      }
      else if(existingUser.isVerified===false){
        console.log("you are not a verified user");
          }
      else{
        let result=await bcrypt.compare(req.body.lpassword,existingUser.password);
        if(result){
          let token_payload={userdata:existingUser};
          const token_jwt=jwt.sign(token_payload,process.env.SECRET_KEY,{
              expiresIn:"1h",
          });
          res.cookie("token_data",token_jwt,{
              expires:new Date(Date.now()+3600000),
              httpOnly:true,
          });
          console.log("login Successful");
          res.redirect('/user/cardprod')
          // res.send("go to dashboard")
          }
          else{
            req.flash("error","Invalid password");
            res.redirect("/sign-in");
            console.log("incorrect password");
          }
          
      }
  }catch(err)
  {
    console.log("error to failed login",err);

  }

}
//authorization part
const userAuth=async(req,res,next)=>{
  try{
      console.log("user::",req.user);
      if(req.user){
          next();

      }else{
          console.log("need to login first");
          res.redirect('/sign-in')
      }
  }catch(err)
  {
      throw err;
  }
};
// const web_page=async(req,res)=>{
//   // let user_data=req.user.userdata;
//   res.render('user/webPage',{
//       title:'web_form',
//       data:{}
//   })
// }
const cardUserProduct=async(req,res)=>{
  try{
      let userData=await adminModel.find();
      console.log("user data detail:",userData);
      if(userData){
          res.render('user/webPage',{
              title:'All card_products',
              data:userData
          })
      }
  }catch(error){
      console.log("Data not Found",error);
  }
}

const post_add_to_cart=async(req,res)=>{
  try{
    let pId=req.body.product_id;
    let quantity=req.body.quantity;
    let userId=req.user.userdata._id;
    // const storeData=new cartModel
    let cartValue=[];
    let cartData=await cartModel.find({userId:userId,productId:pId})
    console.log("cartdata",cartData);
    if(cartData==''){
      let productForCart=await adminModel.findOne({_id:pId})
      console.log("product For Cart",productForCart);
      cartValue.push(productForCart)
      const cartProduct=new cartModel({
        productId:pId,
        userId:userId,
        quantity:quantity,
        cart:cartValue
      })
      let result=await cartProduct.save()
      console.log("product added into cart successfully",result);
      res.redirect("/user/viewAddToCard");


    }else{
      cartData[0].quantity=cartData[0].quantity+1;
      let result=await cartData[0].save();
      console.log("product again added into cart successfully",result);
      res.redirect("/user/viewAddToCard")
    }

  }catch(err){
    console.log("error to add to cart",err);
  }
}


const viewAddToCard=async(req,res)=>{
  try{
    const user_Id=req.user.userdata._id;
    console.log("from viewad_cart",user_Id);
    const cart_Data=await cartModel.find();
    console.log("viewAddtocart",cart_Data);
    if(cart_Data)
    {
      res.render("user/add_to_card",{
        title:"cart",
        data:cart_Data
      });
    }
  }catch(err){
    console.log("data not found",err);
  }
}

const quantityAdd=async(req,res)=>{
  try{
      const cart_id=req.params.cart_id;
      console.log("of cart id:",cart_id);
      const cartData=await cartModel.findOne({_id:cart_id})
      console.log(cartData,"Existing product");
      
      if(cartData){
          cartData.quantity=cartData.quantity+1;
          let result=await cartData.save()
          if(result){
              console.log("product quantity increased");
              res.redirect("/user/viewAddToCard")
          }
          else{
              console.log("no change in quantity");
              res.redirect("/user/viewAddToCard")
          }
      
      }
  }catch(err){
      console.log("error to find product",err);
  }
}

const quantitySubs=async(req,res)=>{
  try{
      const cart_id=req.params.cart_id;
      console.log("of cart id:",cart_id);
      const cartData=await cartModel.findOne({_id:cart_id})
      if(cartData){
          cartData.quantity=cartData.quantity-1;
          let result=await cartData.save()
          if(result){
              console.log("product quantity decreased");
              res.redirect("/user/viewAddToCard")
          }
          else{
              console.log("no change in quantity");
              res.redirect("/user/viewAddToCard")
          }
      
      }
  }catch(err){
      console.log("error to find product",err);
  }
}


const getContactdetail=(req,res)=>{
  let con_user_data=req.user.userdata
  if(con_user_data){
    res.render('user/webPage',{
      title:'Contact Us',
      
  
    })
  }
}

const post_contact=async(req,res)=>{
  try{
    console.log("collected value form contact",req.body);
        const storeData=new contactModel({
          contact_name:req.body.contact_name,
          contact_email:req.body.contact_email,
          contact_number:req.body.contact_number,
          contact_description:req.body.c_description,
    })
    let saved=await storeData.save();
    if(saved){
        let mailOptions={
          from:req.body.contact_email,
          to:'chakrabortysantanu1999@gmail.com',
          subject:'Sucessful send Massage',
          text:'Hello'+req.body.contact_name+",\n\n your detail has sent:\n "+req.body.contact_name+","+","+req.body.contact_email+","+req.body.contact_number+","+req.body.c_description+
          "/mail_confirmation/"+
          '\n\nThank you\n'
      };
      transporter.sendMail(mailOptions,function(error,info)
        {
          if(error)
              {
                  console.log("error to send mail",error);
                      
              }
              else{
                    console.log("Email sent",info.response);
                    res.redirect('/user/cardprod')
                  }
        }
      )
    }

  }
  catch(err){
    console.log("error to add contact",err);
  }

}
const order_placed=async(req,res,next)=>{
 try{
   order_place_user_data=req.user.userdata;
  if(order_place_user_data){
    res.render("user/orderPlaced",{
      title:"Order Placed",
    })
  }
  next();
  
 }catch(err){
  console.log("error to add contact",err);
 }
}

const deleteOrder=async(req,res)=>{
  try{
    const order_place_delete=await cartModel.deleteMany()

  }catch(err){
    console.log("error to delete order",err);
  }
}
const viewProfile=async(req,res)=>{
  try{
    let viewDetail=await AccountModel.find()
    console.log("collected data from viewdetail",viewDetail);
    if(viewDetail)
    {
        res.render('user/profile',{
            title:"view product",
            data:viewDetail
        })
    }
}catch(err){
    console.log("Data not fetched",err);
}
}

const viewProfileEdit=async(req,res)=>{
  try{
      let profile_id=req.params.pid
      let old=await AccountModel.findById(profile_id)
      if(old){
          res.render('user/editProfile',{
              title:"edit page",
              data:old
          })
      }

  }
  catch(err){
      console.log("Data not found",err);
  }

}

const editProfilePost=async(req,res)=>{
  try{
      const Newprofile_id=req.body.pid;

      const update_fulname=req.body.fulname
      const update_number=req.body.ephone
      const update_address=req.body.eaddress

      let profileData=await AccountModel.findOne({_id:Newprofile_id})
      console.log("get id:",profileData);

      profileData.full_name=update_fulname;
      profileData.contact_no=update_number;
      profileData.address=update_address;

      let saved=await profileData.save()
      if(saved)
          {
              console.log("profile is saved");
              res.redirect('/user/profile')
      }
      
  }
  catch(err){
      console.log("error for edit",err);

  }


}

const deleteProfile=async(req,res)=>{
  try{
      let profile_id=req.params.id;
      let deleted=await AccountModel.findOneAndDelete({_id:profile_id}) 
      console.log("Deleted product:",deleted);
      res.redirect('/user/profile')

      
  }catch(err){
      console.log("error in deletion",err);
  }
  

}

const getEmailForgotPass=(req,res)=>{
  let email_link=req.flash("msgLink")
  console.log("link for mail to get new passWord",email_link);
  let emailPass=(email_link.length>0 ? email_link[0] : null);
  res.render('user/emailForgotPass',{
    title:"email for forgot pass",
    emailMassage:emailPass
  });
}
const postEmailForgotPass=async(req,res)=>{
  try{
    console.log("the email got for the generate new password",req.body.foremail);
    let existmail=await AccountModel.findOne({email:req.body.foremail})
    if(existmail){
      let mailOptions={
        from:'chakrabortysantanu1999@gmail.com',
        to:req.body.foremail,
        subject:'Forgot Password',
        text:'Hello'+existmail.full_name+"\n\n"+' you can reset your password by clicking the link below'+'\n\n'+ 
        "http://"+req.headers.host+
        "/reset_password/"+
        req.body.foremail+
        '\n\nThank you\n'
    };
    transporter.sendMail(mailOptions,function(error,info)
      {
        if(error)
            {
                console.log("error to send mail",error);
                res.redirect('/sign-up');
                    
            }
            else{
                  console.log("Email sent",info.response);
                  req.flash("msgLink","check your registered mail Id to get the link  for create new password");
                  res.redirect('/getEmailForgotPas')
                }
      }
    )

    }else{
      console.log("Invalid Email");
      res.send('Invalid email')
    }

  }catch(err){
    console.log("error in post email forgot pass",err);
  }
}

const PasswordCreatePage=(req,res)=>{
  res.render("user/forgotPassCreate",{
    title:"create new password",
    data:req.params.email

  })
}
const getForgotPass=(req,res)=>{
  console.log("email collected from page",req.params.email);
  res.render("user/forgotPassCreate",{
    title:"forget_password",
    data:req.params.email
  })
}

const postForgetPass=async(req,res)=>{
  try{
      console.log("forgot password detail:",req.body.foremail,req.body.npassword,req.body.rpassword);
      if(req.body.npassword !== req.body.rpassword ){
        res.send("your new password and retype password does not match")
      }
      else{
        let hashPassword = await bcrypt.hash(req.body.npassword,12)
        console.log("hash pasword for forget password",hashPassword);
        let passWord_data=await AccountModel.findOne({email:req.body.foremail})
        passWord_data.password=hashPassword
        let savePass=await passWord_data.save()
        if(savePass){
          console.log("your new password has been saved");
          res.redirect("/sign-in")
        }
      }
  }catch(err){
    console.log("error in post forget pass",err);
  }
}


const logout=async(req,res)=>{
  try{
      console.log(req.cookies.token_data);
      await res.clearCookie('token_data');
      res.redirect("/sign-in");
      console.log("Log out successfull");
  }catch(err){
      console.log("logout fail",err);
  }
}

module.exports = {
  getSignUpForm,
  postSignUpForm,
  getSignInForm,
  mailConfirm,
  postSignInForm,
  userAuth,
  // web_page,
  cardUserProduct,
  viewAddToCard,
  post_add_to_cart,
  getContactdetail,
  post_contact,
  order_placed,
  quantityAdd,
  quantitySubs,
  deleteOrder,
  viewProfile,
  viewProfileEdit,
  editProfilePost,
  deleteProfile,
  getEmailForgotPass,
  postEmailForgotPass,
  PasswordCreatePage,
  getForgotPass,
  postForgetPass,
  logout
};
