import { Document, model, Schema } from 'mongoose'
import shortid from 'shortid'

const ImgSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    data: Buffer,
    contentType: String
})

export type ImgType = Document & {
    _id: string,
    data: Buffer,
    contentType: string
}

export default model<ImgType>("Images", ImgSchema, "Images")
