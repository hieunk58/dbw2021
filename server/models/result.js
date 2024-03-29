var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResultSchema = new Schema({
  student: { type: Schema.ObjectId, ref: 'User', required: true },
  subject: { type: Schema.ObjectId, ref: 'Subject', required: true },
  test: { type: Schema.ObjectId, ref: 'Test', required: true },
  score: { type: Number, min: 0, max: 5 }
});

// Export model.
module.exports = mongoose.model('Result', ResultSchema);
