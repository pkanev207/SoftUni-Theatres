const { Schema, model, Types: { ObjectId } } = require('mongoose');

const palySchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, maxlength: [50, 'Description should be maximum 50 symbols!'] },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: String, required: true, default: (new Date()).toISOString().slice(0, 10) },
    likes: { type: [ObjectId], ref: 'User', default: [] },
    owner: { type: ObjectId, ref: 'User' }
});

palySchema.index({ title: 1 }, {
    unique: true,
    collation: { locale: 'en', strength: 2 },
});


const Play = model('Play', palySchema);

module.exports = Play;