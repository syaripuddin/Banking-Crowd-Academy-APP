const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: [true, "Please input topic name!"]
    },
    topicDetail: {
        type: String,
        required: [true, "Please input topic detail!"]
    },
    topicDokumen: {
        type: String,
        required: [true, "Please input topic dokumen!"]
    },

}, { timestamps: true });

const Article = mongoose.model('Class', classSchema);

module.exports = Article;