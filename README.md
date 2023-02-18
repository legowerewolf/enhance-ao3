# Miscellaneous userscripts and bookmarklets

⚠️ This repository has transitioned from `master` to `main` as the primary
branch. Please ensure that userscripts are monitoring the correct branch for
updates. Replace `master` with `main` in the `@updateURL` and `@downloadURL`
entries in the userscripts' headers.

## Userscripts

Don't have a userscript extension? Try
[Violentmonkey](https://violentmonkey.github.io/)!

### ao3-helpers (functional, active maintenance)

[Install](https://raw.githubusercontent.com/legowerewolf/Userscripts/main/ao3-helpers.user.js)
|
[File a bug report](https://github.com/legowerewolf/Userscripts/issues/new?labels=ao3-helpers)

Adds hotkeys to AO3 for:

- navigation on works, between works in a series, and on index pages
  (<kbd>←</kbd>, <kbd>→</kbd>)
- bookmarking a work or series (<kbd>b</kbd>)
- recommending a work or series (<kbd>b</kbd>+<kbd>r</kbd>)
- creating a private bookmark (<kbd>b</kbd>+<kbd>p</kbd>)
- subscribing to a work, series, or author (<kbd>s</kbd>)
- kudosing a work (<kbd>k</kbd>)
- copying a selected text fragment to the comment box and jumping to it
  (<kbd>c</kbd>)
- saving a work to Pocket (<kbd>p</kbd>)

Also includes:

- an experiment to parse metadata from work pages. **This does not send any data
  to anyone.** You can view what's been parsed in the browser console as
  `document.AO3_work_data`.
- [prefetch hinting][mdn-prefetch-faq] for next chapters/works/index pages. As
  of otwarchive v0.9.336.10 this has no effect due to cache policy response
  headers, but it should make the reading experience smoother in the future.

<small>_View the
[related issues](https://github.com/legowerewolf/Userscripts/issues?q=is%3Aissue+is%3Aopen+label%3Aao3-helpers)
for features and bugfixes in the works._</small>

### link-sanitizer (functional, not actively maintained)

Removes tracking parameters from links from the Twitter on-page share button. I
want to make it work with more sites (Tumblr, Twitter), but I haven't gotten
around to it yet.

### auto-purchase free books (functional, not actively maintained)

Automatically purchases free ebooks on Amazon and Google Play. This is useful in
coordination with lists of free/reduced-price ebooks.

The script attempts to verify that the book is free before purchasing it. **I am
not responsible for any charges incurred by using this script. You have been
warned.**

### link-fixer (functional, not actively maintained)

Removes click.redditmail.com redirects on all websites. I use NextDNS to block
tracking-links, so this provides a workaround for my emails from Reddit.

**This uses a page-wide MutationObserver, so it may have a performance impact.
Another method of redirection is recommended.**

### wikipedia mobile toggle (broken, not actively maintained)

Switches between desktop and mobile Wikipedia based on screen width. Use the
"Vector (2022)" skin in responsive mode instead.

[mdn-prefetch-faq]:
	https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
