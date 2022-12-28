const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title must be provided'],
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    thumbnailImage: {
      type: String,
    },
    descriptionImage: {
      type: String,
    },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } }
);

categorySchema.virtual('childCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
  justOne: false,
});

const autoPopulateChildren = function (next) {
  this.populate('childCategories')
  next();
};

categorySchema
  .pre('findOne', autoPopulateChildren)
  .pre('find', autoPopulateChildren);

module.exports = mongoose.model('Category', categorySchema);