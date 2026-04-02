import mongoose from "mongoose";

const Blacklist=new mongoose.Schema({
  token:{
    type:String,
    required:true,
    unique:true
  }
},{timestamps:true})

Blacklist.index({createdAt:1},{
  expireAfterSeconds:60*60*24*3
})

const BlackListToken=mongoose.model("BlackListToken",Blacklist)
export default BlackListToken