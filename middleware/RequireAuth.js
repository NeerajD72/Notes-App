import logger from "../config/logger.js"
import asynchandler from "../lib/asyncHandler.js"
import BlackListToken from "../model/blacklisttoken.js"
import User from "../model/user.js"
import { verifyAccessToken, RefreshTokenVerify, AccessToken } from "../lib/tokens.js"

const requireAuth = asynchandler(async (req, resp, next) => {
  const accesstoken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1]
  const refreshtoken = req.cookies?.refreshtoken
  if (!accesstoken || !refreshtoken) {
    return resp.redirect('/auth/google')
  }
  try {
    if (accesstoken) {
      const blackListToken = await BlackListToken.findOne({ token: accessToken });
      if (!blackListToken) {
        const payload = await verifyAccessToken(accessToken);
        const user = await User.findById(payload.userID || payload._id);

        if (user) {
          req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified
          };
          logger.info("auth verified by access token");
          return next();
        }
      }
    }
  } catch (err) {
    logger.error(err.message);
  }


try {
  const blackListedRefresh = await BlackListToken.findOne({ token: refreshToken });
  if (blackListedRefresh) {
    return resp.redirect("/auth/google");
  }

  const payload = await RefreshTokenVerify(refreshToken);
  const user = await User.findById(payload.userID || payload._id);

  if (!user) {
    return resp.redirect("/auth/google");
  }

  const newAccessToken = await AccessToken(user._id);

  resp.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
  });
  req.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified
  };

  logger.info("access token refreshed successfully");
  return next();
}catch(err){
  logger.error(err.message);
  return resp.redirect("/auth/google");
}

})
export default requireAuth