const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
    comment:{type:String, required:true, trim:true},
    commentTo:{type:Schema.Types.ObjectId, ref:"Post"},
    commentBy:{type:Schema.Types.ObjectId, ref:"User"},
},
{
    timestamps:true, versionKey:false
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;