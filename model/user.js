import mongoose, { Schema } from "mongoose";

const userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  name:{
    type:String,

  },
  password:{
    type:String,
    required:true,
    min:8
  },
  isEmailVerified:{
      type:Boolean,
      default:false
    },
},{timestamps:true})

const User=mongoose.model('User',userSchema)
export default User