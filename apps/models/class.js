const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, "Please input class name!"]
    },
    classTopic: {
        type: String,
        required: [true, "Please input class topic!"]
    },
    classDetail: {
        type: String,
        required: [true, "Please input class detail!"]
    },
    classPhoto: {
        typpe: String,
        required: [true, "Please upload class photo!"]
    },
    classStatus: {
        type: Boolean,
        default: false
    },
    classStart: {
        type: String,
        required: [true, "Please input date class started!"]
    },
    classEnd: {
        type: String,
        required: [true, "Please input date class ended!"]
    },


}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
df