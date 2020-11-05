// Import Socket.IO front-side
const socket = io('/');

// We Get The Container and DOM element, 
// You don't need jQuery for that. Please use vanilla js for that thanks love you
const videoGrid = document.querySelector('#container--video');
const videoGridSelf = document.querySelector('#container--selfVideo');
const name = document.getElementById('name');
const nameSelf = document.getElementById('nameSelf');

// Declare Peer object (the server)
const myPeer = new Peer(undefined, {
	host: '/',
	port: '3001',
});

// We Create self video Component
const selfVideo = document.createElement('video');
selfVideo.setAttribute('id', 'selfVideo');
selfVideo.muted = true; // Pretty explatanory ?

var peersName = [];  // <Work In Progress>
let ownName = {};  // <Work In Progress>
let peers = {}; // User To Temp Storage Of Peer

// We Ask For Video And Audio, which return a promise.
navigator.mediaDevices
	.getUserMedia({
		video: true, // Tweak that !
		audio: true, // Tweak that !
	})
	.then((stream) => {
		addVideoStream(selfVideo, stream); 

		myPeer.on('call', (call) => {
			call.answer(stream);
			const video = document.createElement('video');
			video.setAttribute('class', 'peerVideo');
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream);
			});
		});

		socket.on('user-connected', (userId) => {
			setTimeout(() => {
				connectToNewUser(userId, stream);
				console.log('User connected :', userId); // Tell The User That Another User Has Arrived
			}, 1500);
			alert(userId + ' joined');
		});

		console.log('all good ?');
	})
	.catch(() => {
		console.log('video and audio did not work'); // Debug Utility
		videoGrid.append('sadly your video and audio could not be reached. xoxo');
	});

socket.on('user-disconnected', (userId) => {
	setTimeout(() => {
		// Tell The User (console side :) )That Another User Has Arrived
		console.log('User disconnected :', userId);
		for (let i = 0; i < peersName.length; i++) { 			// <Work In Progress>
			if (userId == peersName[i]) peersName.splice(i, 1); // <Work In Progress>
		} 														// <Work In Progress>
		if (peersName.length != 0) console.table(peersName); 	// <Work In Progress>
		if (peers[userId]) peers[userId].close();
		for (let id in peers) {
			if (peers[userId] == id) peers[userId].close();
		}
	}, 1500);
});

// Event Listener on peer
myPeer.on('open', (id) => {
	// send event to server (used as event listener)
	socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
	const call = myPeer.call(userId, stream);
	const video = document.createElement('video');
	/*
	For future use cases, i added unique class for each peer. 
	This struggle to work (as other functions of my project yet) when we're not the first user in the room 
	*/
	video.setAttribute('class', `peerVideo ${userId}`);

	// Push the id in an array for the use case of muting other
	peersName.push(userId);
	console.table(peersName);

	// Add the video element to html
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream);
	});

	// Remove the video element from html tree
	call.on('close', () => {
		// video.innerHTMl=''; somewath a fix
		// This doesn't work as good as I thinked. Will maybe use <MutationObserver> for that.
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
		videoGridSelf.append(video);
	}
	if (video.id == '') {
		videoGrid.append(video);
	}
	// videoGrid.innerHTML+=userId.toString();
}
let peersContainer = document.getElementById('container--video');
let peersChildren = { childList: peersContainer.childNodes };
const other = document.getElementsByTagName('video');

const observer = new MutationObserver(function () {
	// console.log('Number of peers :', peersChildren['childList'].length);
	// console.log('Observer[InstanceOfMutationObserver] detected a change on ' + peersContainer.id);
	if (peersChildren['childList'].length === 0) {
		alert("You're alone, maybe you want to leave ?");
	}
});
observer.observe(peersContainer, peersChildren);
/* Front & Ui Links */
document.getElementById('roomId').innerHTML += `<b>Room ID</b> <span id="roomidSpan">${ROOM_ID}</span>`;
document.getElementsByTagName('title')[0].innerHTML += '-- ' + ROOM_ID;
