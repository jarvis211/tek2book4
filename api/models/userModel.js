var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    local: {
        name: { type: String },
        username: { type: String, unique: true },
        email: { type: String },
        password: { type: String },
        confirmPassword: { typr: String }
    }
})

module.exports = mongoose.model('users', userSchema);