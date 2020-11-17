const mongoose = require('mongoose');
//const { stringify } = require('querystring');  // ini buat apa ya??? @rian


const topicSchema = new mongoose.Schema({
    classId: {
        type: String
    },
    topicName: {
        type: String,
        required: [true, "Please input topic name!"]
    },
    topicDetail: {
        type: String,
        required: [true, "Please input topic detail!"]
    },
    topicDocument: {
        type: String,
    },

}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;