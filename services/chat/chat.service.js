const Joi = require('joi');
const requestHelper = require("../../common/request_helper");
const utils = require('../../common/utils');
class ChatService {
  constructor(ChatModel) {
    this.ChatModel = ChatModel;
    this.getGroupLastMessage = this.getGroupLastMessage.bind(this);
    this.getUserLastMessage = this.getUserLastMessage.bind(this);
    this._reponse = {
      status: true,
      message: "Server error! Please try again later",
    };
  }

  //get last message of user from group
  async getGroupLastMessage(req) {
    let groupName = req.query.groupName || "";
    let fromUser = req.query.fromUser || "";
    try {
      const schema = Joi.object().keys({
        groupName: Joi.string().required(),
        fromUser: Joi.string().required()
      });
      await utils.validate({groupName,fromUser}, schema)
      const lastMessage = await this.ChatModel.find({ groupName, fromUser }).sort({ createdAt: -1 }).limit(1);
      if (lastMessage) {
        this._response = {
          status: true,
          data: lastMessage,
        };
        return requestHelper.respondWithJsonBody(200, this._response);
      } else {
        this._response = { status: true, message: "No message" };
        return requestHelper.respondWithJsonBody(200, this._response);
      }
    } catch (err) {
      this._response = { status: false, message: err.message };
      if (err && err.status_code == 400) {
        return requestHelper.respondWithJsonBody(400, this._response);
      }
      return requestHelper.respondWithJsonBody(500, this._response);
    }
  }

  //get last message of user from other user
  async getUserLastMessage(req) {
    let toUser = req.query.toUser || "";
    let fromUser = req.query.fromUser || "";
    let dU = [toUser, fromUser];
    let channel = dU.sort().toString().replace(',','');
    try {
      const schema = Joi.object().keys({
        toUser: Joi.string().required(),
        fromUser: Joi.string().required()
      });
      await utils.validate({toUser,fromUser}, schema)
      const lastMessage = await this.ChatModel.find({ groupName: channel, fromUser }).sort({ createdAt: -1 }).limit(1);
      if (lastMessage) {
        this._response = {
          status: true,
          data: lastMessage,
        };
        return requestHelper.respondWithJsonBody(200, this._response);
      } else {
        this._response = { status: true, message: "No message" };
        return requestHelper.respondWithJsonBody(200, this._response);
      }
    } catch (err) {
      this._response = { status: false, message: err.message };
      if (err && err.status_code == 400) {
        return requestHelper.respondWithJsonBody(400, this._response);
      }
      return requestHelper.respondWithJsonBody(500, this._response);
    }
  }
}
module.exports = ChatService;
