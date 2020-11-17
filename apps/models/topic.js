const mongoose = require('mongoose');
//const { stringify } = require('querystring');  // ini buat apa ya??? @rian


const topicSchema = new mongoose.Schema({
    classid: {
        type: String
    },
    topicname: {
        type: String,
        required: [true, "Please input topic name!"]
    },
    topicdetail: {
        type: String,
        required: [true, "Please input topic detail!"]
    },
    topicdocument: {
        type: String,
    },

}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;