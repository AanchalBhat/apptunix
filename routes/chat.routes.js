const router = require('express').Router()
const { chatService } = require("../services/index")
const requestHelper = require('../common/request_helper');

    // getGroupLastMessage
    router.get('/getGroupLastMessage', async (req, res) => {
        const result = await chatService.getGroupLastMessage(req);
        return requestHelper.handleResponse(res, result)
    })

    // getUserLastMessage
    router.get('/getUserLastMessage', async (req, res) => {
        const result = await chatService.getUserLastMessage(req)
        return requestHelper.handleResponse(res, result)
    })


module.exports = router
