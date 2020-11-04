# Vault

## Stack
- nodeJS (:3000)
	- express `^3.1.5`
	- uuid `^8.3.1`
	- socket.io `^2.3.0`
	- peerjs `1.3.1`

---
## Description

Video and Audio call app.
As simple as that.

You can generate a room, either with and unique id thanks to `uuid`, either with a custom name (under some little regEXP rules) thanks to optional routes params of nodeJS.

## v.001 ----

	- Talk, See. Listen, Be Seen.
	- Mute Self, Mute Peers (front-side only)
	- Room's URL Copy, User Has Autonomy.
	- Get an alert when the room's empty.

---

## Technical Informations

Importants files :
	- ./server.js ---- Main back-end file. Store nodeJS server boilerplate
Dev and Prod infrastructure environement are a bit different in the way of security, which will be more explained in the next section.

Technology is webSocket : so you could technically maintain bridge between you and your peers even if you kill node process.

If you run peerJS server at port `:3001`, you should fire the project as :
```bash
node server.js & peerjs -p 3001
```

## Deploy guidelines

Features used as the `.getUserMedia` method need security.

Using self-signed certificate directly in nodeJS is never a good idea.

You should use a reverse-proxy (or any other method that take responsability of the SSL thingy).

If you want to use Nginx, you should make it listen to `:80` and `:443` ports. Then, make it proxy-pass the node server which can listen at `:3000` port. The peerJS (if you want to host it, like me : you shuld install peerjs globally) can listen to `:3001` port for example.

Then, you need to specify SSL key and certificate to Nginx, not to node. PeerJS should also have the sames credentials. You could either make it raw in front-side javascript (in he `/public/script/main.js` file) or directly specify those credentials in the server-start-up command-line.

So it would be now :
```bash
node server.js & peerjs -p 3001 --sslkey yourkey.key --sscert yourcertificate.crt
```

And heeeere you go. 

Have fun. 

(Right?)