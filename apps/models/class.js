const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    classname: {
        type: String,
        required: [true, "Please input class name!"]
    },
    classtopic: {
        type: String,
        required: [true, "Please input class topic!"]
    },
    classdetail: {
        type: String,
        required: [true, "Please input class detail!"]
    },
    classphoto: {
        typpe: String,
        required: [true, "Please upload class photo!"]
    },
    classstatus: {
        type: Boolean,
        default: false
    },
    classstart: {
        type: String,
        required: [true, "Please input date class started!"]
    },
    classend: {
        type: String,
        required: [true, "Please input date class ended!"]
    },


}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
df