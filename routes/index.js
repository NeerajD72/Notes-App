import { Router } from "express";
import {homepage,About, Features, FAQs} from '../controller/maiControlleer.js'

const routes=Router()

routes.get('/',homepage)
routes.get('/about',About)
routes.get('/features',Features)
routes.get('/faq',FAQs)
export default routes