# Vault

### Stack
- nodeJS (:3000)
	- express
	- uuid
	- socket.io
	- peerjs (:3001, path /)
	- http
- nginx (:443 sinon :80)
	- reverse proxy (listen to nodeJS port)

---
### Qu'est ce que c'est

C'est un projet fait en un week end, pour m'entraîner à comprendre webRTC et ce qui tourne autour.

Du coup, en fonctionalités :

- Generation d'une room 
	- uuid
	- nom customisé (avec une regEx quand même !)
- Visio conférence
	- Video
	- Audio
		- Se muter (côté front)
		- Muter les autres (côté front)
	- Copier le lien de la room avec un bouton
	- Etre alerté lorsqu'on est seul dans la room
	- Quelques fonctionalités que j'ai commencé dans le code, mais pas implémenté comme choisir son nom ou autre.

---

### Problématique 

Les fonctionalités getUserMedia ont besoin de sécurité, donc de SSL/HTTPS.

J'ai un VPS chez OVH.

J'ai deux noms de domaine à disposition pour ma part.

J'ai lié ce vps (avec son IP, donc) à un sous domaine `vault.otho.bike`.

S'il le faut, je peux le lier à un nom de domaine fraîchement crée `otho.fun`.

Donc, mon serveur nginx écoute le port 3000 qui correspond au process nodeJS.

Mon serveur peerJS tourne sur la même machine (en faisant un `node server.js & peerjs -p 3001 &`) et donc a besoin d'être proxied aussi.