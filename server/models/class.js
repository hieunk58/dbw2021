var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = new Schema({
  class_name: { type: String, required: true, unique: true, maxLength: 200 }
});

// Export model.
module.exports = mongoose.model('Class', ClassSchema);
