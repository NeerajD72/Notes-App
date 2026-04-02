import { Router } from "express";
import { googleLogin,googleLoginHandler,logout } from "../controller/authcontroller.js";
import requireAuth from "../middleware/RequireAuth.js";

const routes=Router()

routes.get('/auth/google',googleLogin)
routes.get('/auth/google/callback',googleLoginHandler)
routes.post('/logout',requireAuth,logout)

export default routes

