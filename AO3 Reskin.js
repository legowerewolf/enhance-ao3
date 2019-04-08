// ==UserScript==
// @name         AO3 Reskin
// @namespace    legowerewolf.tk
// @version      0.1.1
// @updateURL    https://raw.githubusercontent.com/legowerewolf/Userscripts/master/AO3%20Reskin.js
// @downloadURL  https://raw.githubusercontent.com/legowerewolf/Userscripts/master/AO3%20Reskin.js
// @description  Capture work data from Archive of Our Own.
// @author       legowerewolf.tk
// @match        https://archiveofourown.org/works/*
// @grant        none
// ==/UserScript==

(function() {
	"use strict";

	fetch(window.location.pathname) // Fetch the current page and grab the body as text
		.then((resp) => resp.text())

		// Turn the text into a HTML doc fragment
		.then((data) => {
			let parser = new DOMParser();
			return parser.parseFromString(data, "text/html");
		})

		// Mine the doc fragment for work data
		.then((page) => {
			return {
				title: (() => page.querySelector(".title.heading").innerText.trim())(),
				author: (() => {
					let a = document.querySelector("[rel=author]");
					return {
						name: a.innerText.trim(),
						profile: a.href
					};
				})(),
				tags: (() =>
					["rating", "warning", "category", "fandom", "relationship", "character", "freeform"].reduce((tags, category) => {
						return {
							...tags,
							[category]: Array.from(page.querySelectorAll(`.${category}.tags .tag`)).map((tag) => {
								return {
									tagName: tag.innerText,
									tagLink: tag.href
								};
							})
						};
					}, {}))()
			};
		})

		// Print the output of the last 'then' and pipe it forward
		.then((data) => {
			console.log(data);
			return data;
		});
})();
