import { Application } from 'express'
import Image from './Models/img.model'
import { Multer } from 'multer'
import fs from 'fs'
import path from 'path'

export const use = (app: Application, uploader: Multer) => {
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "./Views/upload.html"))
    })

    app.get("/:slug", async (req, res) => {
        const img = await Image.findById(req.params.slug)

        if (img) {
            res.contentType(img.img.contentType)
            res.send(img.img.data)
        } else {
            res.status(404).end()
        }
    })

    app.post("/", uploader.single('image'), async (req, res) => {
        const fp = path.join(__dirname + '/Uploads/' + req.file.filename)
        const data = fs.readFileSync(fp)
        fs.unlinkSync(fp)

        const images = await Image.find()

        for (const img of images) {
            if (img.img.data.compare(data) === 0) {
                /* If some other IP uploads, we want to add them too */
                img.uploaders.push(req.clientIp as string)
                await img.save()
                return res.redirect(`/${img._id}`)
            }
        }

        const img = new Image()

        img.img.contentType = req.file.mimetype
        img.img.data = data
        img.uploaders = req.clientIp ? [req.clientIp as string] : []

        await img.save()
        return res.redirect(`/${img._id}`)
    })
}