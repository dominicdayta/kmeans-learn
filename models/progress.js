const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },

    lesson : {
        type: String,
        required: true
    },

    dateCompleted : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Progress', progressSchema, 'progress');