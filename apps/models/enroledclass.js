const mongoose = require('mongoose');


// ini skema database buat tracking murid guru di kelas mana , udah lulus apa belum siswa nya
const EnroledSchema = new mongoose.Schema({
    classId: {
        type: String
    },
    teacherId: {
        type: String
    },
    learnerId: {
        type: String
    },
    topicId: {
        type: String,
    },
    jadwal: {
        type: String,
        required: true,
    },
    statusEnroled: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Enroled = mongoose.model('Enroled', EnroledSchema);

module.exports = Enroled;