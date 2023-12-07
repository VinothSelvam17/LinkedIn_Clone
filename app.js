const express=require("express");
const path = require("path");
const app=express();
const port=2023;
const connectDB = require("./db/connect");
const bodyParser = require("body-parser");
const session = require("express-session");

const middleware=require("./middleware");

app.set("view engine", "pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended:false}));

app.use(
    session({
        secret:"Tutor Joes",
        resave:true,
        saveUninitialized: false,
    })
);


const staticUrl=path.join(__dirname,"public");
app.use(express.static(staticUrl));

app.get(["/","/homePage"], middleware.isLogin, (req, res) =>{
     const payload = {
        pageTitle:"Home Page",
        userDetails: req.session.user,
        userDetailsJson:JSON.stringify(req.session.user),
    };
    res.status(200).render("homePage", payload);
    });

const loginRoute=require("./router/loginRouter");
app.use("/loginPage", loginRoute);

const registerRoute=require("./router/registerRouter");
app.use("/registerPage", registerRoute);

const logoutRoute=require("./router/logoutRoute");
app.use("/logoutPage", logoutRoute);

const postRoute=require("./router/PostRouter");
app.use("/posts", postRoute);

const postApiRoute= require("./router/api/post");
app.use("/api/posts",postApiRoute);

app.listen(port, ()=>{
    console.log(`Server Running in Port ${port}`);
});