const express=require("express");
const router = express.Router();

router.get("/:id", (req,res)=>{
    const pageData={
        title:"Post Page",
        userDetails:req.session.user,
        userDetailsJson:JSON.stringify(req.session.user),
        postId:req.params.id,
    };
    res.status(200).render("postPage", pageData);
});

module.exports=router;