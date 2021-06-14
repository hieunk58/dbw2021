var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClassSchema = new Schema({
  class_name: { type: String, required: true, unique: true, dropDups: true, maxLength: 200 },
//   subject: [{ type: Schema.ObjectId, ref: 'Subject' }], // subject list: 0..N
//   student: [{ type: Schema.ObjectId, ref: 'User' }], // student list: 0..N
});

// Virtual for class's url
ClassSchema
.virtual('url')
.get(function() {
    return '/class/' + this._id; // TODO define url later
});

// Export model.
module.exports = mongoose.model('Subject', ClassSchema);
