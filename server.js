import dotenv  from 'dotenv'
dotenv.config()
import app from './app.js'
import connection from './config/db.js'
import logger from './config/logger.js'


const startServer=async()=>{
    await connection()
    app.listen(process.env.PORT,()=>{
      logger.info(`server listening at ${process.env.PORT}`)
    })
}

startServer().catch(err=>{
  logger.error(err)
  process.exit(1)
})