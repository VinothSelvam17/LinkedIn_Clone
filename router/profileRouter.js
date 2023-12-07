const express=require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    const pageData={
        title:"Profile Page",
        userDetails:req.session.user,
        userDetailsJson:JSON.stringify(req.session.user),
        profileUser:req.session.user,
    };
    res.status(200).render("profilePage", pageData);
});

module.exports=router;