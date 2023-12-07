const express=require("express");
const app = express();
const router = express.Router();
const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

app.set("view engine","pug");
app.set("views","views");
app.use(bodyParser.urlencoded({extended: false}));

router.get("/", (req, res)=>{
    const payload={
        pageTitle: "Register Page",
    }
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).render("registerPage", payload);
});

router.post("/", async (req, res)=>{
    console.log(req.body);
    const username=req.body.username;
    const role=req.body.role;
    const email=req.body.email;
    const phonenumber=req.body.phonenumber;
    const password=req.body.password;
    const payload = req.body;
    payload.pageTitle= "Register Page";

    if(username && role && email && phonenumber&& password){
        const user= await User.findOne({
            $or:[{username:username},{email:email}],
        }).catch((err) =>{
            console.log(err);
            payload.errorMessage = " Something Went Wrong...! ";
            return res.status(200).render("registerPage",payload);
        });
        if(user == null){
            const data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data).then((user)=>{
            console.log(user);
                req.session.user=user;
                return res.redirect("/");
            });
        }else{
            payload.errorMessage = "Username or Email already Take...!";
            return res.status(200).render("registerPage", payload);
        }
    }else{
        payload.errorMessage = "Make Sure each field as vaild value ";
        return res.status(200).render("registerPage", payload);
    }
}); 

module.exports = router;