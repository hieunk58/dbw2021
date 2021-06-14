const { DateTime } = require("luxon");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestSchema = new Schema({
  name: { type: String, required: true, maxLength: 200 },
  test_date: { type: Date, default: Date.now },
  subject: [{ type: Schema.ObjectId, ref: 'Subject' }],
});

// Virtual for test's url
TestSchema
.virtual('url')
.get(function() {
    return '/test/' + this._id; // TODO define url later
});

TestSchema
.virtual('test_date_formatted')
.get(function() {
    return DateTime.fromJSDate(this.test_date).toLocaleString(DateTime.DATETIME_MED);
});
// Export model.
module.exports = mongoose.model('Subject', TestSchema);
