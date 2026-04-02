import { Router } from "express";
import { dashboard,addNotes,UpdateNote,DeleteNote,dashboardViewNotes, dashboardNoteSubmit, dashboardSearch, dashboardSearchSubmit } from "../controller/dashBoardController.js";
import requireAuth from "../middleware/RequireAuth.js";

const routes=Router()

routes.get('/dashboard',requireAuth,dashboard)
routes.get('/dashboard/item-view/:id',requireAuth,dashboardViewNotes)
routes.put('/dashboard/item/:id',requireAuth,UpdateNote)
routes.delete('/dashboard/item-delete/:id',requireAuth,DeleteNote)
routes.get('/dashboard/add',requireAuth,addNotes)
routes.post('/dashboard/add',requireAuth,dashboardNoteSubmit)
routes.get('/dashboard/search',requireAuth,dashboardSearch)
routes.post('/dashboard/search',requireAuth,dashboardSearchSubmit)
export default routes