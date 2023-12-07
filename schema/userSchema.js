const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username:{type:String,required:true,trim:true,unique:true},
        role:{type:String,requried:true,trim:true},
        email:{type:String,required:true,trim:true},
        phonenumber:{type:Number,required:true,trim:true},
        password:{type:String,required:true,trim:true},
        profilePic: {type:String, default:"/images/profilePic.png"},
        likes:[{type:Schema.Types.ObjectId, ref:"Post"}],
        retweets:[{type:Schema.Types.ObjectId, ref:"Post"}],
    },
    {timestamps:true}
);

const User = mongoose.model("User", UserSchema);    

module.exports = User;
