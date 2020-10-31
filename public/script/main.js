const socket = io('/');

// We Get The Grid, all my homies hate jquery please use vanilla js for that thanks love you
const videoGrid = document.querySelector('#container--video');
const videoGridSelf = document.querySelector('#container--selfVideo');
// console.log(videoGrid); usual check because i'm an unsecure person

const myPeer = new Peer(undefined, {
	host: '/',
	port: '3001',
});

// We Create self video Component
const selfVideo = document.createElement('video');
selfVideo.setAttribute('id','selfVideo');
selfVideo.muted = true; // Pretty explatanory ?

let peers = {};

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		// on promise :
		addVideoStream(selfVideo, stream);

		myPeer.on('call', (call) => {
			call.answer(stream);
			const video = document.createElement('video');
			video.setAttribute('class','peerVideo');
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream);
			});
		});

		socket.on('user-connected', (userId) => {
			setTimeout(() => {
				connectToNewUser(userId, stream);
				console.log('User connected :', userId); // Tell The User That Another User Has Arrived
			}, 3000);
		});

		console.log('all good ?');
	})
	.catch(() => {
		console.log('video and audio did not work');
		// videoGrid.append('sadly your video and audio could not be reached. xoxo');
		// document.getElementById('header__title').append('sadly your video and audio could not be reached. xoxo');
	});

socket.on('user-disconnected', (userId) => {
	setTimeout(() => {
		console.log('User disconnected :', userId); // Tell The User That Another User Has Arrived
		if (peers[userId]) peers[userId].close();
	}, 3000);
});

// Event Listener on peer
myPeer.on('open', (id) => {
	// send event to server (used as event listener)
	socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
	const call = myPeer.call(userId, stream);
	const video = document.createElement('video');
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream);
	});
	call.on('close', () => {
		// video.innerHTMl=''; somewath a fix
		video.remove();
	});

	peers[userId] = call;
}

function addVideoStream(video, stream) {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play(); // When video loaded... play it !
	});
	if (video.id == 'selfVideo') {
		videoGridSelf.append(video); // classic !
	} 
	if (video.id == '') {

		videoGrid.append(video); // classic !
	}
	// videoGrid.innerHTML+=userId.toString();
}

/* Front & Ui Links */
/* let copyLink = document.createElement('a');
copyLink.innerHTML = `<a id="copyLink" href="${window.location.href}">Copy room's url to the clipboard</a>`;
document.querySelector('.header__title').append(copyLink);
copyLink.addEventListener('click', function (e) {
	e.preventDefault();
	let loc = document.createElement('textarea');
	loc.innerHTML = window.location.href;
	document.body.appendChild(loc);
	loc.select();
	document.execCommand('copy');
	document.body.removeChild(loc);
	alert('You got the url ! Share it with your loved one. Or your boss. Sad for ya tough.');
}); */
/* document.getElementById('roomId').innerHTML += '<b>Room ID</b> --' + ROOM_ID;
document.getElementsByTagName('title')[0].innerHTML+= '-- ' + ROOM_ID; */
