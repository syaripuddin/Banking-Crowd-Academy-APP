const mongoose = require('mongoose');


// ini skema database buat tracking murid guru di kelas mana , udah lulus apa belum siswa nya
const EnroledSchema = new mongoose.Schema({
    classid: {
        type: String
    },
    teacherid: {
        type: String
    },
    learnerid: {
        type: String
    },
    topicid: {
        type: String,
    },
    jadwal: {
        type: String,
        required: true,
    },
    statusenroled: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Enroled = mongoose.model('Enroled', EnroledSchema);

module.exports = Enroled;
t