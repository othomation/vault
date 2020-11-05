//======== MODULES
//---- RAW require
require("dotenv").config();
const express = require('express');
const http = require('http');
//---- DYNAMIC require()
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

//======= ROUTES IMPORT
const index = require('./routes/front--index');
const vaultUuid = require('./routes/front--vault_uuid_endpoint');
const vaultCustom = require('./routes/front--vault_custom_endpoint');
//---- Routes Usages
app.use('/', index);
app.use('/vault', vaultUuid);
app.use('/:vault', vaultCustom);

//======== PUBLIC FOLDER
app.use(express.static('public'));

//======== VIEWS
app.set('view engine', 'ejs');

//======== SOCKET.IO
io.on('connection', (socket) => {
	//==== Event(s) Listener
	//---- Catch New Client
	socket.on('join-room', (roomId, userId) => {
		//-- Log Every New Client
		console.log('roomId :', roomId + ' | userId :', userId);
		//-- Send New Arrival To User (sort of add to queue)
		socket.join(roomId);
		//-- Send This Info To All Except Self (broadcast) (user-connected is an 'event' to listen to in front script)
		socket.to(roomId).broadcast.emit('user-connected', userId);
		//-- On 'disconnect' event, Tell Self that Peer Quitted
		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId);
		});
	});
});

server.listen(process.env.HTTP_PORT); 
console.log(`Running good. \n ---> PORT : ${process.env.HTTP_PORT}`);
