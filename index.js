const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const DBM = require("./config/db")
const apiRoutes = require('./routes')
var clients = [];
const chatModel = require('./services/chat/chat.model');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

const DBManager = new DBM()
DBManager.connectToDatabase();

//return view
app.get('/', function(req, res) {
    res.render('index.ejs');
});

//APIs routes
app.use('/api/v1', apiRoutes)

//Sockets
io.sockets.on('connection', function(socket) {
    socket.on('user', function(data) {
        if(data.groupName) {
        socket.join(data.groupName);
        socket.to(data.groupName).emit('is_online', '🟢 <i>' + data.userName + ' join the chat..</i>');
        }
        else{
            let toUser = data.toUser;
            let fromUser = data.fromUser;
            let dUser = [toUser, fromUser];
            let uniqRoom = dUser.sort().toString().replace(',','')
            socket.join(uniqRoom);
            socket.to(uniqRoom).emit('is_online', '🟢 <i>' + data.userName + ' join the chat..</i>');
        }
    });

    socket.on('chat_message', async function(data) {
        if(data.groupName) {
        const chat = new chatModel({
            groupName: data.groupName,
            fromUser: data.userName,
            toUser: null,
            message: data.message
            });
        await chat.save();
        socket.to(data.groupName).emit('chat_message', '<strong>' + data.userName + '</strong>: ' + data.message);
        }else {
            let toUser = data.toUser;
            let fromUser = data.fromUser;
            let dUser = [toUser, fromUser];
            let uniqRoom = dUser.sort().toString().replace(',','')
            const chat = new chatModel({
                groupName: uniqRoom,
                fromUser,
                toUser,
                message: data.message
              });
            await chat.save();
            socket.to(uniqRoom).emit('chat_message', '<strong>' + fromUser + '</strong>: ' + data.message);

        }
    });

    socket.on('registerUser', function(data){
          clients.push(data.userName);
          io.sockets.emit('registerResponse',{status:'success',users:[... new Set(clients)]});
      });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
    console.log('---------------------------------------');
    console.log('\x1b[32m','Application running on localhost:8080');
    console.log('---------------------------------------');
    console.log('\x1b[33m%s\x1b[0m','API endpoint: localhost:8080/api/v1');
    console.log('API 1: localhost:8080/api/v1/chat/getGroupLastMessage?groupName=dev&fromUser=aanchal');
    console.log('API 2: localhost:8080/api/v1/chat/getUserLastMessage?fromUser=aanchal&toUser=dev');
});