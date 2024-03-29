var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: { type: String, required: true, dropDups: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, unique: true, required: true, maxLength: 20 },
  password: { type: String, required: true, maxLength: 100 },
  role: { type: Schema.ObjectId, ref: 'Role' }
});

// Export model.
module.exports = mongoose.model('User', UserSchema);
