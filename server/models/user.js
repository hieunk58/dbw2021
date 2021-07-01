var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: { type: String, required: true, dropDups: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, unique: true, required: true, maxLength: 20 },
  password: { type: String, required: true, maxLength: 100 },
  role: { type: Schema.ObjectId, ref: 'Role' }
});

// Virtual for user "full" name.
UserSchema.virtual('full_name').get(function() {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for user's url
UserSchema
.virtual('url')
.get(function() {
    return '/user/' + this._id; // TODO define url later
});

// Export model.
module.exports = mongoose.model('User', UserSchema);