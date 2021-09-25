// ==UserScript==
// @name         AO3 Helpers
// @namespace    legowerewolf.net
// @version      0.1.2
// @updateURL    https://raw.githubusercontent.com/legowerewolf/Userscripts/master/ao3-helpers.user.js
// @downloadURL  https://raw.githubusercontent.com/legowerewolf/Userscripts/master/ao3-helpers.user.js
// @description  Capture work data from Archive of Our Own.
// @author       legowerewolf.net
// @match        https://archiveofourown.org/works/*
// @grant        none
// ==/UserScript==

"use strict";

function main() {
	const data = {
		title: document.querySelector(".title.heading").innerText.trim(),
		author: (() => {
			let a = document.querySelector("[rel=author]");
			return {
				name: a.innerText.trim(),
				profile: a.href,
			};
		})(),
		tags: [
			"rating",
			"warning",
			"category",
			"fandom",
			"relationship",
			"character",
			"freeform",
		].reduce((tags, category) => {
			return {
				...tags,
				[category]: Array.from(
					page.querySelectorAll(`.${category}.tags .tag`)
				).map((tag) => {
					return {
						tagName: tag.innerText,
						tagLink: tag.href,
					};
				}),
			};
		}, {}),
	};

	console.debug(data);
}

if (document.readyState === "loading") {
	document.addEventListener("load", main);
} else {
	main();
}
