const mongoose = require('mongoose');

const subcategorySchema = new mongoose.schema({
    title: {
        type: String,
        required: [true, '']
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    subcategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subcategory',
    },
}, { timestamps: true });

// one of category or subcategory must be provided

module.exports = mongoose.model('Subcategory', subcategorySchema);