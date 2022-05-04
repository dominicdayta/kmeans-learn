const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },

    firstName : {
        type: String,
        required: true
    },

    lastName : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    treatment: {
        type: Boolean,
        required: true
    },

    superUser: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Students', studentSchema, 'studentlist');