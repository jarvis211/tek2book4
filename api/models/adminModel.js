var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    local: {
        username: { type: String },
        password: { type: String }
    }
    
});

module.exports = mongoose.model('admin-auth', adminSchema);