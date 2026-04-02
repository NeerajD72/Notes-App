import { Router } from "express";
import {homepage,About} from '../controller/maiControlleer.js'

const routes=Router()

routes.get('/',homepage)
routes.get('/about',About)

export default routes