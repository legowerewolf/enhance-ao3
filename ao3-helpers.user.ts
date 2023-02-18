// ==UserScript==
// @name            AO3 Hotkeys (branch:beta)
// @namespace       legowerewolf.net
// @author          Lego (@legowerewolf)
// @version         0.5.13
// @description     Adds hotkeys to AO3 for navigation and work- and series-related actions.
// @homepageURL     https://github.com/legowerewolf/Userscripts/tree/beta
// @supportURL      https://github.com/legowerewolf/Userscripts/issues/new?labels=ao3-helpers

// @updateURL       https://raw.githubusercontent.com/legowerewolf/Userscripts/beta/ao3-helpers.user.js
// @downloadURL     https://raw.githubusercontent.com/legowerewolf/Userscripts/beta/ao3-helpers.user.js

// @require         https://raw.githubusercontent.com/legowerewolf/Userscripts/beta/lib/HotkeyEngine.js
// @require         https://raw.githubusercontent.com/legowerewolf/Userscripts/beta/lib/interactions.js

// @grant           none
// @match           https://archiveofourown.org/*
// ==/UserScript==

"use strict";

// section: CSS selectors for the elements we want to interact with

const SELECTORS = {
	workBody: "#workskin",

	kudosButton: "#kudo_submit",

	plainCommentField: "textarea.comment_form",
	tinyMCECommentField: "#tinymce",
	tinyMCEFrame: "#comment-form iframe",

	chaptersStatsSpan: ".stats dd.chapters",

	markForLaterButton: "li.mark a",

	shareButton: "li.share a",

	openBookmarkFormButton: "li.bookmark a.bookmark_form_placement_open",
	commitBookmarkButton: "#bookmark-form input[type='submit'][name='commit']",
	bookmarkRecCheckbox: "#bookmark_rec",
	bookmarkRecCheckboxLabel: "label[for='bookmark_rec']",
	bookmarkPrivateCheckbox: "#bookmark_private",
	bookmarkPrivateCheckboxLabel: "label[for='bookmark_private']",

	subscribeButton: "#new_subscription input[type='submit']",
	hiddenSubscribeDeleteInput:
		"#new_subscription input[name='_method'][value='delete']",

	viewWorkEntireButton: "li.chapter.entire a",
	viewWorkChapterByChapterButton: "li.chapter.bychapter a",

	workNextChapterLink: "li.chapter.next a",
	workPreviousChapterLink: "li.chapter.previous a",

	seriesNextWorkLink: "dd.series span:only-child a.next",
	seriesPreviousWorkLink: "dd.series span:only-child a.previous",

	indexNextPageLink: "li.next a[rel='next']",
	indexPreviousPageLink: "li.previous a[rel='prev']",
};

// section: hotkey action functions

const createBookmark = click(SELECTORS.commitBookmarkButton);

const createRecBookmark = doSequence(
	setProperty<HTMLInputElement>(SELECTORS.bookmarkRecCheckbox, "checked", true),
	createBookmark
);

const createPrivateBookmark = doSequence(
	setProperty<HTMLInputElement>(
		SELECTORS.bookmarkPrivateCheckbox,
		"checked",
		true
	),
	createBookmark
);

const goToNextPage = doFirst(
	click(SELECTORS.indexNextPageLink),
	click(SELECTORS.workNextChapterLink),
	click(SELECTORS.seriesNextWorkLink)
);

const goToPreviousPage = doFirst(
	click(SELECTORS.indexPreviousPageLink),
	click(SELECTORS.workPreviousChapterLink),
	click(SELECTORS.seriesPreviousWorkLink)
);

const superkudos = doSequence(
	click(SELECTORS.kudosButton),
	appendText(SELECTORS.tinyMCECommentField, "❤️")
);

const supercomment = () => {
	// get the selection, if any
	let selection = document.getSelection();
	if (selection.type !== "Range") return;

	// grab the text and return position
	let anchor = selection.anchorNode;
	let value = selection.getRangeAt(0).cloneContents();

	// update the comment field and place the cursor at the end
	const commentField = getElement<HTMLBodyElement>(
		SELECTORS.tinyMCECommentField,
		getElement<HTMLIFrameElement>(SELECTORS.tinyMCEFrame).contentDocument
	);
	let quote = document.createElement("blockquote");
	quote.appendChild(value);
	commentField.appendChild(quote);
	commentField.focus();

	// add a link back to where we selected from
	let backlink: HTMLAnchorElement;
	try {
		backlink = getElement<HTMLAnchorElement>("#ao3-helper-comment-backlink");
	} catch {
		backlink = document.createElement("a");
		backlink.id = "ao3-helper-comment-backlink";
		backlink.classList.add("action");
		backlink.innerText = "Return to last selection";
		let insertionPoint = getElement<HTMLParagraphElement>(
			"#add_comment p.submit.actions"
		);
		insertionPoint.prepend(backlink);
	} finally {
		backlink.onclick = () => anchor.parentElement.scrollIntoView();
	}
};

const subscribe = () => {
	try {
		getElement(SELECTORS.hiddenSubscribeDeleteInput);
	} catch {
		click(SELECTORS.subscribeButton)();
	}
};

const saveWorkToPocket = () => {
	if (document.AO3_work_data.id === -1) {
		alert("Work ID not found. Are you sure this is a work page?");
	}

	let pocketSubmitURL = new URL("https://getpocket.com/save");
	pocketSubmitURL.searchParams.set(
		"url",
		`https://archiveofourown.org/works/${document.AO3_work_data.id}?view_adult=true&view_full_work=true`
	);
	pocketSubmitURL.searchParams.set("title", document.title);

	let w = window.open(
		pocketSubmitURL.toString(),
		"Pocket",
		"popup,left=250,top=250,height=200,width=500"
	);

	let cleanupWindow = () => {
		w.close();
	};

	let closeEventController = new AbortController();
	window.addEventListener("beforeunload", cleanupWindow, {
		signal: closeEventController.signal,
	});

	setTimeout(() => {
		cleanupWindow();
		closeEventController.abort();
	}, 5 * 1000);
};

// section: hotkey action helpers

const warnDeprecation =
	(oldkey: string, newkey: string, action: CallableFunction) => () => {
		alert(
			`The hotkey "${oldkey}" is deprecated. ${
				newkey ? `Use "${newkey}" instead.` : ""
			}`
		);
		action();
	};

// section: hotkey declarations

const HOTKEYS: HotkeyConfig[] = [
	[["arrowleft"], goToPreviousPage],
	[["arrowright"], goToNextPage],
	[["b"], createBookmark],
	[["s"], subscribe],
	[["b", "r"], createRecBookmark],
	[["b", "p"], createPrivateBookmark],
	[["r"], warnDeprecation("r", "b + r", createRecBookmark)],
	[["h"], warnDeprecation("h", "b + p", createPrivateBookmark)],
	[["c"], supercomment],
];

const WORK_HOTKEYS: HotkeyConfig[] = [
	[["p"], saveWorkToPocket],
	[["k"], superkudos],
	[["l"], warnDeprecation("l", "k", superkudos)],
];

const HOTKEYS_DISPLAY = {
	[[
		SELECTORS.indexPreviousPageLink,
		SELECTORS.workPreviousChapterLink,
		SELECTORS.seriesPreviousWorkLink,
	].join(", ")]: "←",
	[[
		SELECTORS.indexNextPageLink,
		SELECTORS.workNextChapterLink,
		SELECTORS.seriesNextWorkLink,
	].join(", ")]: "→",
	[SELECTORS.openBookmarkFormButton]: "b",
	[SELECTORS.subscribeButton]: "s",
	[SELECTORS.bookmarkRecCheckboxLabel]: "b + r",
	[SELECTORS.bookmarkPrivateCheckboxLabel]: "b + p",
	[SELECTORS.kudosButton]: "k",
};

// section: functions that execute automatically, as part of initialization

function getWorkData(): WorkData {
	// get title
	let title = getElement(".title.heading").innerText.trim();

	// get work ID
	let id = -1;
	let hasWorkLink = doFirst(
		() => getElement<HTMLAnchorElement>(SELECTORS.markForLaterButton),
		() => getElement<HTMLAnchorElement>(SELECTORS.shareButton),
		() => getElement<HTMLAnchorElement>(SELECTORS.viewWorkEntireButton),
		() =>
			getElement<HTMLAnchorElement>(SELECTORS.viewWorkChapterByChapterButton)
	)();
	let matches = hasWorkLink.href.match(/works\/(\d+)/);
	if (1 in matches) id = parseInt(matches[1]);
	else console.error("Could not find work ID on page.");

	// get author
	let author: NamedLink;
	try {
		let authorLink = getElement<HTMLAnchorElement>("[rel=author]");
		author = {
			name: authorLink.innerText.trim(),
			link: authorLink.href,
		};
	} catch {
		author = {
			name: getElement("h2.title + h3.byline").innerText.trim(),
			link: undefined,
		};
	}

	// get chapter info
	let [chapters_complete, chapters_total] = getElement<HTMLSpanElement>(
		SELECTORS.chaptersStatsSpan
	)
		.innerText.split("/")
		.map((s) => parseInt(s) || -1);

	// get tag categories
	let tag_categories = new Set<string>();
	let tagCategoryElements = getElements(".work.meta.group dt.tags");
	for (let node of tagCategoryElements) {
		node.classList.forEach((c: string) => tag_categories.add(c));
	}
	tag_categories.delete("tags");

	// get tags
	let tags: Record<string, NamedLink[]> = {};
	for (const category of tag_categories) {
		tags[category] = getElements<HTMLAnchorElement>(
			`dd.${category}.tags a.tag`
		).map(
			(tag): NamedLink => ({
				name: tag.innerText,
				link: tag.href,
			})
		);
	}

	return {
		title,
		id,
		author,
		tags,
		status: {
			complete: chapters_complete == chapters_total,
			chapters_complete,
			chapters_total,
		},
	};
}

function addPrefetchLinks() {
	try {
		let prefetchableLinks = getElements<HTMLAnchorElement>(
			[
				SELECTORS.workNextChapterLink,
				SELECTORS.seriesNextWorkLink,
				SELECTORS.indexNextPageLink,
			].join(", ")
		);

		for (let link of prefetchableLinks) {
			let el = Object.assign(document.createElement("link"), {
				rel: "next prefetch",
				type: "text/html",
				href: link.href.split("#")[0],
			});

			document.head.appendChild(el);
		}
	} catch {}
}

async function injectRTE() {
	const scripts = [
		"/javascripts/tinymce/tinymce.min.js",
		"/javascripts/mce_editor.min.js",
	];
	for (const src of scripts) {
		let el = Object.assign(document.createElement("script"), { src });
		document.head.appendChild(el);
		await new Promise((resolve) => (el.onload = resolve));
	}

	const commentField = getElement(SELECTORS.plainCommentField);

	addEditor(commentField.id);
}

function markHotkeys(hotkey_display_map: Record<string, string>) {
	for (const selector in hotkey_display_map) {
		try {
			const element = getElement<HTMLInputElement | HTMLTextAreaElement>(
				selector
			);

			const prop = element.nodeName == "INPUT" ? "value" : "innerHTML";

			element[prop] += ` [${hotkey_display_map[selector]}]`;
		} catch {}
	}
}

function main() {
	// mark hotkeys in the UI
	markHotkeys(HOTKEYS_DISPLAY);

	// add prefetch links
	addPrefetchLinks();

	const engine = new HotkeyEngine();
	HOTKEYS.forEach(([keys, handler]) => engine.registerAction(keys, handler));

	// work processing
	if (document.querySelector("#workskin")) {
		// add work-specific hotkeys
		WORK_HOTKEYS.forEach(([keys, handler]) =>
			engine.registerAction(keys, handler)
		);

		// parse work data from the header
		try {
			document.AO3_work_data = getWorkData();
			console.debug(document.AO3_work_data);
		} catch (error) {
			console.error("Could not get work data.", error);
		}

		// inject rich text editor
		injectRTE();
	}

	engine.attach(document.body);
}

// wait for the page to finish loading before running the script
if (document.readyState === "loading") {
	document.addEventListener("load", main);
} else {
	main();
}
