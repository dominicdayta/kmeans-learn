const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },

    type : {
        type: String,
        required: true
    },

    answers : {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema, 'assessment');