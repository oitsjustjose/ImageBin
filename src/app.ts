import { json, urlencoded } from 'body-parser'
import { config } from 'dotenv'
import express, { Application } from 'express'
import { existsSync, mkdirSync } from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import * as routes from './app/routes'
import {mw as RipMw} from 'request-ip'

config()

const init = async () => {
    const app = express()

    app.use(RipMw())
    app.use(json())
    app.use(urlencoded({
        extended: true
    }))

    await mongoose.connect(`mongodb://${process.env.MONGO_URI}/Images`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const uploadPath = path.join(__dirname, './app/Uploads')
    if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath)
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}`)
        }
    })

    const uploader = multer({ storage })

    routes.use(app, uploader)

    return app
}

init().then((app: Application) => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on http://localhost:${process.env.PORT}`)
    })
}).catch((err) => {
    console.error(err)
    process.exit(-1)
})
