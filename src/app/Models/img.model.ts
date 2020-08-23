import { Document, model, Schema } from 'mongoose'
import shortid from 'shortid'
import moment from 'moment'

const ImgSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    createdAt: {
        type: Date,
        default: moment().toISOString()
    },
    uploaders: [String],
    img: {
        contentType: String,
        data: Buffer,
    }
})

export type ImgType = Document & {
    _id: string,
    createdAt: Date,
    uploaders: string[],
    img: {
        contentType: string,
        data: Buffer
    }
}

export default model<ImgType>("Images", ImgSchema, "Images")
