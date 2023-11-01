import mongoose from 'mongoose';

const Authentication_schema = new mongoose.Schema({
    UserName:{
        type: String,
        required: true,
        minlength: 6
    },
    Password:{
        type: String,
        required: true,
        minlength:6
    }
})

module.exports=mongoose.model("Login_Credentials",Authentication_schema)