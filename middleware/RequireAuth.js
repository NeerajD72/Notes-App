import logger from "../config/logger.js"
import  asynchandler  from "../lib/asyncHandler.js"
import BlackListToken from "../model/blacklisttoken.js"
import User from "../model/user.js"
import { verifyAccessToken } from "../lib/tokens.js"

const requireAuth=asynchandler(async(req,resp,next)=>{
  const token = req.cookies.accessToken ||  req.headers.authorization?.split(' ')[1]
if (!token) {
  return resp.redirect('/auth/google')
}

  const blackListToken=await BlackListToken.findOne({token})
  if(blackListToken){
    return resp.status(400).json({msg:'token is invalid'})
  }

  let payload
  try{
    payload=await verifyAccessToken(token)
    if(!payload){
      return resp.status(400).json({msg:'you dont have access token'})
    }
  }catch(err){
    logger.error(err)
    return resp.redirect('/auth/google')
  }

  const user =await User.findById(payload._id)
  if(!user){
    return resp.status(400).json({msg:'user not found'})
  }
  req.user={
    _id:user._id,
    name:user.name,
    email:user.email,
    isEmailVerified:user.isEmailVerified
  }
  logger.info('auth verified')
  next()
})

export default requireAuth