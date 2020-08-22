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
            res.contentType(img.contentType)
            res.send(img.data)
        } else {
            res.status(404).end()
        }
    })

    app.post("/", uploader.single('image'), async (req, res) => {
        const fp = path.join(__dirname + '/Uploads/' + req.file.filename)
        const img = new Image({
            data: fs.readFileSync(fp),
            contentType: req.file.mimetype
        })
        await img.save()

        res.redirect(`/${img._id}`)
        // fs.unlinkSync(fp)
    })
}