import mongoose from "mongoose";

const NoteSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }

},{timestamps:true})

const Notes=mongoose.model('Notes',NoteSchema)
export default Notes