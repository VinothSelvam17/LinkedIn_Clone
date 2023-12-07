const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

const User = require("../../schema/userSchema");
const Post = require("../../schema/PostSchema");
const Comment = require("../../schema/commentSchema");

router.get("/", (req, res)=>{
    Post.find()
        .populate("postedBy")
        .populate("retweetData")
        .sort({createdAt:1})
        .then(async (results) => {
            results = await User.populate(results, {path: "retweetData.postedBy"});
            res.status(200).send(results);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(400);
        });
});

router.post("/", async (req, res)=>{
    console.log(req.body);
    if(!req.body.content){
        console.log("Post not Found");
        res.sendStatus(400);
    }
    const postData ={
        content: req.body.content,
        postedBy: req.session.user,
    };

    Post.create(postData).then(async (newPost) =>{
        newPost = await User.populate(newPost, {path:"postedBy"});
        return res.status(200).send(newPost);
    });
});

router.put("/:id/like", async (req, res) =>{
    const postId = req.params.id;
    const userId = req.session.user._id;
    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    const option = isLiked ? "$pull" : "$addToSet";
    req.session.user = await User.findByIdAndUpdate (userId, {[option]: {likes : postId}},{new: true}).catch((error) =>{
            console.log(error);
            req.sendStatus(400);
        });
    const post = await Post.findByIdAndUpdate(postId, {[option]: {likes : userId}},{new : true}).catch((error) =>{
            console.log(error);
            req.sendStatus(400);
        });
        res.status(200).send(post);
});
router.post("/:id/retweet", async (req, res) =>{
    const postId = req.params.id;
    const userId = req.session.user._id;
    const deletedPost = await Post.findOneAndDelete({postedBy: userId, retweetData: postId}).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });
    let repost = deletedPost;
    if(repost == null){
        repost = await Post.create({postedBy: userId, retweetData:postId}).catch((error)=>{
            console.log(error);
            req.sendStatus(400);
        });
    }
    const option = deletedPost ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(userId, {[option]: {retweets: repost._id}},{new:true}).catch((error) => {
        console.log(error);
        req.sendStatus(400);
    });
    const post = await Post.findByIdAndUpdate(postId, {[option]: {retweetUsers: userId} },{new:true}).catch((error) =>{
        console.log(error);
        req.sendStatus(400);
    });
    res.status(200).send(post);
}); 

router.post("/:id/comment", async(req, res)=>{
    const postId=req.params.id;
    const comment=req.body.comment;
    const userId=req.session.user._id;

    let postedComment=await Comment.create({
        comment:comment,
        commentBy:userId,
        commentTo:postId,
    }).catch((error)=>{
        console.log(error);
        req.sendStatus(400);
    });
    const post =await Post.findByIdAndUpdate(postId, {$push: {commentUsers: userId} },{new:true}).catch((error)=>{
        console.log(error);
        req.sendStatus(400);
    });

    res.status(200).send(postedComment);
});

router.get("/:id/usercomment", async(req, res)=>{
    const postId=req.params.id;
    const comments=await Comment.find({commentTo:postId})
    .populate("commentBy")
    .sort({createAt:1})
    .then(async (results)=>{
        results = await User.populate(results, {path:"commentBy.postedBy"});
        return res.status(200).send(results);
    })
    .catch((error)=>{
        console.log(error);
        return req.sendStatus(400);
    });
});

router.get("/:id/single", (req,res)=>{
    const postId=req.params.id;
    Post.findById({_id: postId})
        .populate("postedBy")
        .populate("retweetData")
        .sort({createAt:1})
        .then(async (results) => {
            results = await User.populate(results, {path:"retweetData.postedBy"});
            
            const comments = await Comment.find({commentTo: postId}).populate("commentBy").sort({createAt:1});

            return res.status(200).send({post:results, comments:comments});
        })
        .catch((err)=>{
            console.log(err);
            return res.sendStatus(400);
        });
});

router.delete("/:id/", async (req, res) =>{
    const postId=req.params.id;
    const userId=req.session.userId;
    try{    
        await Post.findByIdAndDelete(postId);
        await Post.deleteMany({retweetData:postId});
        await Comment.deleteMany({commetTo:postId});
        return res.status(200).send({send:"success"});
    }catch(error){  
        console.log(error);
    }
});

module.exports=router;