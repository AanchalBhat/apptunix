const ChatModel = require("./chat/chat.model");
const ChatService = require("./chat/chat.service");
module.exports = {
  chatService: new ChatService(ChatModel)
};
