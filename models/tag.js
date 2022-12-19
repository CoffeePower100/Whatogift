import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tagId: mongoose.Schema.Types.ObjectId,
    tagName: String
})

export default mongoose.model('Tag', tagSchema);
