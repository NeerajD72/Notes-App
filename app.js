import express from 'express'
import cookieParser from 'cookie-parser'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import path from 'path'
import routes from './routes/index.js'
import DashBoardroutes from './routes/dashboard.js'
import authRoutes from './routes/authroutes.js'
import methodOverride from 'method-override'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app=express()


//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
//static file

app.use(express.static(path.join(__dirname, 'public')))
// templating engines
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))
app.set('layout','./layouts/main')
app.set('view engine','ejs')

//routes
app.use('/',routes)
app.use('/',DashBoardroutes)
app.use('/',authRoutes)
app.get('*splat',(req,res)=>{
  res.status(404).render('404')
})


export default app