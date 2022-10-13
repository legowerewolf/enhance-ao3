// ==UserScript==
// @name        	Reddit link fixer
// @namespace   	legowerewolf.net
// @match       	*://*/*
// @grant       	none
// @version     	1.0
// @updateURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/master/link-fixer.user.js
// @downloadURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/master/link-fixer.user.js
// @author      	legowerewolf.net
// ==/UserScript==

"use strict";

const REDDITMAIL = "https://click.redditmail.com/CL0/";

function debounce(func, timeout = 100) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

const handler = () => {
	document.querySelectorAll(`a[href^="${REDDITMAIL}"]`).forEach((a) => {
		a.href = decodeURIComponent(
			a.href.substr("https://click.redditmail.com/CL0/".length)
		).split("?")[0];
	});
};

const OBSERVER = new MutationObserver(debounce(handler));
OBSERVER.observe(document.body, { subtree: true, childList: true });
