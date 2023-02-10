// ==UserScript==
// @name			Link sanitizer
// @namespace		legowerewolf.net
// @version			0.0.3
// @updateURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/main/link-sanitizer.user.js
// @downloadURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/main/link-sanitizer.user.js
// @description		Automatically strip query strings from links.
// @author			legowerewolf.net
// @match			https://*.twitter.com/*
// @grant			none
// ==/UserScript==

document.addEventListener("copy", (e) => {
	let text = window.getSelection().toString();

	try {
		let url = new URL(text);

		e.preventDefault();
		e.stopPropagation();

		e.clipboardData.clearData();
		e.clipboardData.setData("text/plain", url.origin + url.pathname);
	} catch (err) {}
});
