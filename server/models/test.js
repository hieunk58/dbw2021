var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestSchema = new Schema({
  test_name: { type: String, required: true, maxLength: 200 },
  test_date: { type: Date, default: Date.now, required: true },
  subject: { type: Schema.ObjectId, ref: 'Subject', required: true }
});

// Export model.
module.exports = mongoose.model('Test', TestSchema);
