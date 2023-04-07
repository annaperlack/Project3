const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }

});

const Product = mongoose.model('Product', questionSchema);

module.exports = Product;