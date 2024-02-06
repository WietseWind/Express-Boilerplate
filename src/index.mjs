import express from 'express'
import morgan from 'morgan'
import ip from 'ip'
import cors from 'cors'
import helmet from 'helmet'
import { cloudflareIps } from './helper/cloudflare-ips.mjs'
import dotenv from 'dotenv';

dotenv.config()

const port = process.env?.PORT || 3001
const trustedIpRanges = (process.env?.TRUSTED_IP_RANGES || '127.0.0.1/8 ::1/128').replace(/[^0-9a-f/.:.]+/g, ' ').replace(/[ ]+/g, ' ').trim().split(' ')

const app = express()

app.use(morgan(process.env?.LOGFORMAT || 'combined'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal', ...cloudflareIps, ])

app.use((req, res, next) => {
  if (trustedIpRanges.some(range => ip.cidrSubnet(range).contains(req.ip))) {
    next()
  } else {
    res.status(403).end('Access denied')
  }
})

app.get('/json', (req, res) => {
  res.json({ message: 'This is a JSON response', ip: req.ip, })
})

app.post('/post-json', (req, res) => {
  console.log(req.body) // Log the received JSON to the console
  res.json({ message: 'JSON received', yourData: req.body, ip: req.ip, })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

// Unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
