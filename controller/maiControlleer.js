import express from 'express'
import { title } from 'process'



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

export const Features=async(req,resp)=>{
  const locals={
    title:'Features- Nodejs notes',
    description:'Everything Notes app can do for you'
  }
  resp.render('features',locals)
}


export const FAQs=async(req,resp)=>{
  const locals={
    title:'FAQs -Node js notes App',
    description:'Frequently asked questions'
  }
  resp.render('faq',locals)
}