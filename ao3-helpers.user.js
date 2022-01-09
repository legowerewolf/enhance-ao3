// ==UserScript==
// @name			AO3 Helpers
// @namespace		legowerewolf.net
// @version			0.2.6
// @updateURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/master/ao3-helpers.user.js
// @downloadURL		https://raw.githubusercontent.com/legowerewolf/Userscripts/master/ao3-helpers.user.js
// @description		Parse work data from AO3 and add hotkeys for navigating works and adding kudos.
// @author			legowerewolf.net
// @match			https://archiveofourown.org/works/*
// @match			https://archiveofourown.org/chapters/*
// @grant			none
// ==/UserScript==

"use strict";

function work_getData() {
	let title = document.querySelector(".title.heading").innerText.trim();

	let id = -1;
	let loc = (
		document.querySelector("li.share a") ?? window.location
	).href.match(/works\/(\d+)/);
	if (1 in loc) id = parseInt(loc[1]);
	else console.error("Could not find work ID.");

	let authorLink = document.querySelector("[rel=author]");
	let author = {
		name: authorLink.innerText.trim(),
		profile: authorLink.href,
	};

	let [chapters_complete, chapters_total] = document
		.querySelector(".stats .chapters + .chapters")
		.innerText.split("/")
		.map((s) => parseInt(s) || -1);

	let status_text =
		chapters_complete != chapters_total ? "In Progress" : "Complete";

	let tag_categories = new Set();
	for (let node of document.querySelectorAll(".work.meta.group .tags")) {
		node.classList.forEach((c) => tag_categories.add(c));
	}
	tag_categories.delete("tags");

	let tags = {};
	for (const category of tag_categories) {
		tags[category] = Array.from(
			document.querySelectorAll(`.${category}.tags .tag`)
		).map((tag) => {
			return {
				tagName: tag.innerText,
				tagLink: tag.href,
			};
		});
	}

	return {
		title,
		id,
		author,
		tags,
		status: {
			text: status_text,
			chapters_complete,
			chapters_total,
		},
	};
}

function work_addHotkeys() {
	document.addEventListener("keyup", (event) => {
		if (["INPUT", "TEXTAREA"].find((el) => el == event.target.tagName)) return; // don't interfere with input fields

		switch (event.key.toLowerCase()) {
			case "arrowleft":
				document.querySelector("li.chapter.previous a")?.click();
				break;

			case "arrowright":
				document.querySelector("li.chapter.next a")?.click();
				break;

			case "l":
				document.getElementById("kudo_submit").click();
				break;

			default:
				console.debug("caught unbound key event:", event);
				break;
		}
	});
}

function main() {
	if (window.location.pathname.match(/\/(works|chapters)\/\d+\/?$/)) {
		const data = work_getData();
		console.debug(data);

		work_addHotkeys();
	}
}

// wait for the page to finish loading before running the script
if (document.readyState === "loading") {
	document.addEventListener("load", main);
} else {
	main();
}
