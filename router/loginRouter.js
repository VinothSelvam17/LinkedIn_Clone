const express = require("express");
const app = express();
const router = express.Router();
const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { route } = require("./registerRouter");
const middleware=require("../middleware");

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", middleware.isAlreadyLogin, (req, res) => {
  const payload = {
    pageTitle: "Login Page",
  }
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).render("loginPage", payload);
});

router.post("/", async(req,res)=>{
        const payload=req.body;

        payload.pageTitle = "Login Page";
        if(req.body.username && req.body.password){
            const user = await User.findOne({
                $or:[{username:req.body.username},{password:req.body.password}],
            }).catch((err) =>{
                console.log(err);
                payload.errorMessage = "Something Went Wrong";
                res.status(200).render("loginPage", payload);
            });
            if(user != null){
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result === true){
                    req.session.user=user;
                    return res.redirect("/");
                }
            } else {
                payload.errorMessage = "Login Credentials incorrect";
                return res.status(200).render("loginPage", payload);
              }
            }
          
            payload.errorMessage = "Make Sure each field has a valid value";
            res.status(200).render("loginPage", payload);
    }
);
 
module.exports=router;