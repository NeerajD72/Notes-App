import { OAuth2Client } from "google-auth-library"
import asynchandler from '../lib/asyncHandler.js'
import User from '../model/user.js'
import { AccessToken, RefreshToken } from "../lib/tokens.js"
import BlackListToken from "../model/blacklisttoken.js"
import logger from '../config/logger.js'
import crypto from 'crypto'
import hashPassword from '../lib/hash.js'

async function getGoogleClient(){
  const clientId=process.env.GOOGLE_CLIENT_ID
  const clientSecret=process.env.GOOGLE_CLIENT_SECRET
  const clientRedirect_uri=process.env.GOOGLE_REDIRECT_URI

  if(!clientId || !clientSecret){
     throw new Error('Google client id and secret both are missing')
  }
  return new OAuth2Client(clientId,clientSecret,clientRedirect_uri)
}

export const googleLogin=asynchandler(async(req,resp)=>{

    const client=await getGoogleClient()

    const url=client.generateAuthUrl({
      access_type:'offline',
      prompt:'consent',
      scope:['openid','email','profile'],
      redirect_uri:process.env.GOOGLE_REDIRECT_URI
    })
    return resp.redirect(url)
})

export const googleLoginHandler=asynchandler(async(req,resp)=>{
  const code=req.query.code
  //  console.log('callback hit')        // ← add this
  //  console.log('code:', code)   
  if(!code){
    return resp.status(400).json({msg:'code is missing'})
  }
  
  const client=await getGoogleClient()
  const {tokens}=await client.getToken({code,redirect_uri:process.env.GOOGLE_REDIRECT_URI})
  if(!tokens.id_token){
    return resp.status(400).json({msg:'login token is missing'})
  }

  //verify tokens
  let ticket
  try{

    ticket=await client.verifyIdToken({
    idToken:tokens.id_token,
    audience:process.env.GOOGLE_CLIENT_ID
  })
  }catch(err){
    logger.error(err.message,'login error')
    return resp.status(400).json({msg:'token is wrong'})
  }
  

  const payload=ticket.getPayload()
  const name=payload?.name
  const email=payload?.email
  const emailVerified = payload?.email_verified
  if(!email || !emailVerified){
      return resp.status(400).json({message:"google accoutn is not verified"})
  }

  const normalizeEmail=email.toLowerCase().trim()

  let  user=await User.findOne({email:normalizeEmail})
  if(!user){
    const randomPassword=crypto.randomBytes(36).toString('hex')
    const PasswordHash=await hashPassword(randomPassword)

    user=await User.create({
      name,
      email:normalizeEmail,
      password:PasswordHash,
      isEmailVerified:true
    })
  }
  // else{
  //   return resp.status(400).json({msg:'you are already registerd'})
  // }
  
//   else {
//   // ✅ already exists - show message then redirect to home
//   return resp.send(`
//     <html>
//       <body>
//         <h2>You are already signed up!</h2>
//         <p>Redirecting to home page...</p>
//         <script>
//           setTimeout(() => {
//             window.location.href = '/'
//           }, 2000)
//         </script>
//       </body>
//     </html>
//   `)
// }

  const accessToken=await AccessToken(user._id)
  const refreshToken=await RefreshToken(user._id)

  const isprod=process.env.NODE_ENV==='production'

  resp.cookie("refreshtoken",refreshToken,{
    httpOnly:true,
    secure:isprod,
    sameSite:'lax',
    maxAge:30*24*60*60*1000
  })
  resp.cookie("accessToken",accessToken,{
    httpOnly:true,
    secure:isprod,
    sameSite:'lax',
    maxAge:15*60*1000
  })

  return resp.redirect('/dashboard')
})

export const logout=asynchandler(async(req,resp)=>{
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if(!token){
    return resp.status(401).json({msg:'required token is missing'})
  }
  await BlackListToken.create({
    token:token
  })
  resp.clearCookie("refreshtoken",{path:'/'})
  logger.info('user logout success')
  return resp.redirect('/')
})