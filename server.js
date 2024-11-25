require('dotenv').config();
const express = require('express');
const appServer = express();
const mongoose=require('mongoose')
const path=require("path")
const PORT=process.env.PORT||3111;

const flash=require('connect-flash')
//session package is used to store user information in memory but it has no infinite resource
const session=require('express-session')
const mongodb_session=require('connect-mongodb-session')(session) //useed to store data in session

const cookieParser=require('cookie-parser')

const userRouter=require('./router/userRouter')
const adminRouter=require('./router/adminRouter')

appServer.set("view engine","ejs")
appServer.set("views","view")



appServer.use(express.urlencoded({extended:true}));
appServer.use(express.static(path.join(__dirname,"public")));
appServer.use(express.static(path.join(__dirname,"uploads")));


appServer.use(session({
    secret:'project-secret-key',
    resave:false,
    saveUninitialized:false,
    // store:session_store
}))

appServer.use(flash());
appServer.use(cookieParser());

appServer.use(userRouter);
appServer.use(adminRouter)
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(PORT,()=>{
        console.log("Database connected")
        console.log(`visit at http://localhost:${PORT}`);
    })
})
.catch(err=>{
    console.log("error data",err);
})


