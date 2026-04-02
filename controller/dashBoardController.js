import mongoose from 'mongoose'
import logger from '../config/logger.js'
import Notes from '../model/notes.js'
import asynchandler from'../lib/asyncHandler.js'



export const dashboard=asynchandler(async(req,res)=>{

  let perPage=12
  let page=req.query.page || 1
  
  const locals={
    title:'Dashboard',
    description:'Free Nodejs Notes app'
  }
  
  try{
    const notes=await Notes.aggregate([
      {$sort:{updatedAt:-1}},
      {$match:{user:new mongoose.Types.ObjectId(req.user._id)}},
      {
        $project:{
          title:{$substr:["$title",0,30]},
          body:{$substr:["$body",0,100]}
        }
      }
    ]).skip(perPage * page - perPage).limit(perPage)
 
    const count=await Notes.countDocuments({user:req.user._id})
    res.render('dashboard/index',{
    userName: req.user.name,
    locals,
    notes,
    layout:'../views/layouts/dashboard',
    current:page,
    pages:Math.ceil (count/perPage)
  })
  
  }catch(err){
    logger.error(err)
  }
})


//dashboardViewNote(specific notes)

export const dashboardViewNotes=asynchandler(async(req,resp)=>{
  const notes=await Notes.findOne({_id:req.params.id,user:req.user._id})
  if(notes){
    resp.render('dashboard/view-note',{
      noteID:req.params.id,
      notes,
      layout:"../views/layouts/dashboard"
    })
  }
  else{
    return resp.status(400).json({msg:'cannot find notes'})
  }
})


export const UpdateNote=asynchandler(async(req,resp)=>{
  const update=await Notes.findOneAndUpdate({_id:req.params.id,user:req.user._id},{title:req.body.title,body:req.body.body},{new: true})
  if(update){
   return resp.redirect('/dashboard')
  }
  return resp.status(400).json({ msg: 'cannot update note' })
})


export const DeleteNote=asynchandler(async(req,resp)=>{
  const delet=await Notes.deleteOne({_id:req.params.id,user:req.user._id})
  if(delet.deletedCount >0){
   return resp.redirect('/dashboard')
  }
  return resp.status(400).json({msg:'cannot delete the notes'})
})


export const addNotes=asynchandler(async(req,resp)=>{
  resp.render("dashboard/add",{
    layout:"../views/layouts/dashboard",
  })
})


export const dashboardNoteSubmit=asynchandler(async(req,resp)=>{
  await Notes.create({
    title:req.body.title,
    body:req.body.body,
    user:req.user._id
  })
  return resp.redirect("/dashboard")
})


export const dashboardSearch=asynchandler(async(req,resp)=>{
  resp.render("dashboard/search",{
    searchResults:"",
    layout:"../views/layouts/dashboard",
  })
})

export const dashboardSearchSubmit=asynchandler(async(req,resp)=>{
  let searchTerm=req.body.searchTerm
  const searchNoSpecialChars=searchTerm.replace(/[^a-zA-Z0-9]/g,"")

  const searchResults=await Notes.find({
    $or:[
      {title:{$regex:new RegExp(searchNoSpecialChars,"i")}},
      {body:{$regex:new RegExp(searchNoSpecialChars,"i")}},
    ],
  })
  resp.render("dashboard/search",{
  searchResults,
  layout:"../views/layouts/dashboard",
})
})

