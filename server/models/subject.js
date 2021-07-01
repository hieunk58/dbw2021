var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
  subject_name: { type: String, required: true, unique: true, maxLength: 200 },
  teacher: { type: Schema.ObjectId, ref: 'User', required: true }, // taught by only 1 teacher
  class: { type: Schema.ObjectId, ref: 'Class', required: true }, // belongs to only 1 class
  isArchived: { type: Boolean }
});

// Virtual for subject's url
SubjectSchema
.virtual('url')
.get(function() {
    return '/subject/' + this._id; // TODO define url later
});

// Export model.
module.exports = mongoose.model('Subject', SubjectSchema);
