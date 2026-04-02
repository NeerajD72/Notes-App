import express from 'express'



export const homepage=async(req,res)=>{
  const locals={
    title:'Nodejs Notes',
    description:'Free Nodejs Notes app'
  }
  res.render('index',{
    locals,
    layout:'../views/layouts/front-page'
  })
}

export const About=async(req,res)=>{
  const locals={
    title:'About- Nodejs notes',
    description:'Free hai looto'
  }
  res.render('about',locals)
}