var mongoose = require('mongoose')

var chatSchema = mongoose.Schema({
    groupName: {
        type: String
    },
    fromUser: {
        type: String
    },
    toUser: {
        type: String
    },
    message: {
        type: String
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
});
module.exports = mongoose.model('Chat', chatSchema);