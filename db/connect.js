const mongoose = require("mongoose");
const {modelName} = require("../schema/userSchema");

class Database{
    constructor(){
        this.connect();
    }
    connect(){
        return mongoose
            .connect("mongodb://127.0.0.1:27017/Linkedin")
            .then(()=>{
                console.log("Database Connected");
            })
            .catch((err)=>{
                console.log(err);
            });
    }
}

module.exports=new Database();