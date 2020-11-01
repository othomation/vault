/* Front & Ui Links */
document.getElementById('roomId').innerHTML += `<b>Room ID</b> <span id="roomidSpan">${ROOM_ID}</span>`;
document.getElementsByTagName('title')[0].innerHTML += '-- ' + ROOM_ID;

/* Controls ====================================================================== */

/* Show Controls */
const controls = document.getElementById('controls');
function showControls() {
	if (controls.className == 'hidden') {
		controls.classList.remove('hidden');
	} else {
		controls.className = 'hidden';
	}
}
/* Mute Self (for Self) */
function listenSelf() {
	selfVideo.muted = !selfVideo.muted;
}

/* Mute other (for self)*/
videoGrid.addEventListener('click', (e) => {
	console.log('===' + e.target.classList);
	e.target.muted = !e.target.muted;
	if (e.target.muted == true) {
		e.target.classList.add('muted');
	} else {
		e.target.classList.remove('muted');
	}
	console.log(e.target.muted);
});

/* Copy URL */
const copyLink = document.getElementById('copyLink');
copyLink.addEventListener('click', function (e) {
	e.preventDefault();
	let loc = document.createElement('textarea');
	loc.innerHTML = window.location.href;
	document.body.appendChild(loc);
	loc.select();
	document.execCommand('copy');
	document.body.removeChild(loc);
	alert('You got the url ! Share it with your loved one. Or your boss. Sad for ya tough.');
});
