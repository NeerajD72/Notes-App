
import winston from 'winston'

const isProduction = process.env.NODE_ENV === 'production'

const transports = []

// ✅ Always allow console logs (important for Vercel)
transports.push(
  new winston.transports.Console({
    format: winston.format.simple()
  })
)

// ✅ Only use file logs in local development
if (!isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  )
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
})

export default logger