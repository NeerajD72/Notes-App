import express from 'express'
import cookieParser from 'cookie-parser'
import expressLayouts from 'express-ejs-layouts'
import { fileURLToPath } from 'url'
import path from 'path'
import routes from './routes/index.js'
import DashBoardroutes from './routes/dashboard.js'
import authRoutes from './routes/authroutes.js'
import methodOverride from 'method-override'
import {verifyAccessToken} from'./lib/tokens.js'
import User from './model/user.js'
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

app.use(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken
    if (token) {
      const payload = await verifyAccessToken(token)
      const user = await User.findById(payload._id)
      if (user) {
        req.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    }
  } catch (_) {}
  res.locals.user = req.user || null
  next()
})
//routes
app.use('/',routes)
app.use('/',DashBoardroutes)
app.use('/',authRoutes)
app.get('*splat',(req,res)=>{
  res.status(404).render('404')
})


export default app