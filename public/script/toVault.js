/*
---- toVault.js *
====( Front Side Script )
====( Manage 'CREATE ROOM' button ) 
*/

//==== 
document.getElementById("form").addEventListener("submit", function () {
	let tpStyleMsg;
	let wrapper = document.getElementById("wrapper");
	let tpStyle = document.createElement("style");
	document.getElementsByTagName("head")[0].appendChild(tpStyle);
	wrapper.className = "active";
	area.value == "" ? (tpStyleMsg = "generated place") : (tpStyleMsg = area.value);
	tpStyle.innerHTML += `.active#wrapper::after { content:'Teleportation to ${tpStyleMsg}';}`;
});

function fireVault() {
	let area = document.getElementById("area");
	let form = document.getElementById("form");

	setTimeout(() => {
		if (area.value == "") {
			form.setAttribute("action", "/vault");
			form.submit();
		} else {
			form.setAttribute("action", area.value);
			form.submit();
		}
	}, 3000); // <Animation> To Wait For Opacity Loop In CSS

	wrapper.className -= "active";
}
