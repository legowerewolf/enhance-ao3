javascript: (() => {
	if (window.location.hostname != "mail.google.com") return;

	let highestAccountIndex = Number(
		(
			document.querySelector(
				"[aria-label='Account Information'] a[href^='/mail/data/u/']:last-child"
			) ??
			document.querySelector(
				"[aria-label='Account Information'] a[href^='/mail/u/']:last-child"
			)
		).href.slice(-2, -1)
	);

	let currentAccountIndex = Number(window.location.pathname.slice(-2, -1));
	let nextAccountIndex =
		currentAccountIndex == highestAccountIndex ? 0 : currentAccountIndex + 1;

	window.location.hash = `#inbox`;
	window.location.pathname = `/mail/u/${nextAccountIndex}/`;
})();
