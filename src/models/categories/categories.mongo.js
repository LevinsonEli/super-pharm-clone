const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title must be provided'],
        maxLength: 50,
    },
    description: {
        type: String,
        maxLength: 1000,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);