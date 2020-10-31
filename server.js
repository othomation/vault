const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
let salut = 'bonjour';
// Views
app.set('view engine', 'ejs');
// Public
app.use(express.static('public'));

// Routes

app.get('/', (req, res) => {
	res.render('index');
});
app.get('/vault', (req, res) => {
	res.redirect(`/${uuidV4()}`);
});

const AREA_REGEX = new RegExp('^[a-zA-Z0-9_-]*$');
// const invalidValue='Invalid Value. Contact administrator at contact@otho.bike if you need help !';
app.get('/:room', (req, res) => {
	if (AREA_REGEX.test(req.params.room)) {
		res.render('room', { roomId: req.params.room });
	} else {
		res.redirect('back');
	}
});
// Socket related
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

server.listen(3000);
