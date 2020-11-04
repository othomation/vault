//==== Modules
require("dotenv").config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

// Routes Import
const index = require('./routes/front--index');
const vaultUuid = require('./routes/front--vault_uuid_endpoint');
const vaultCustom = require('./routes/front--vault_custom_endpoint');

//==== Views
app.set('view engine', 'ejs');

//==== Public
app.use(express.static('public'));

//=== Routes
app.use('/', index);
app.use('/vault', vaultUuid);
app.use('/:vault', vaultCustom);

//==== Socket related
io.on('connection', (socket) => {
	// Listen to event
	socket.on('join-room', (roomId, userId) => {
		console.log('roomId :', roomId + ' | userId :', userId);
		socket.join(roomId); // Send New Arrival To User (sort of add to queue)
		socket.to(roomId).broadcast.emit('user-connected', userId); // Send This Info To All Except Self (broadcast) (user-connected is an 'event' to listen to in front script)
	
		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId);
		});
	});
});

server.listen(process.env.HTTP_PORT); 
console.log(`Running good. \n ---> PORT : ${process.env.HTTP_PORT}`);
