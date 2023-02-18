# AO3 Enhancement Suite

## Install

If you have a userscript extension installed,
[click here to install.](https://raw.githubusercontent.com/legowerewolf/Userscripts/main/ao3-helpers.user.js)

Don't have a userscript extension? Try
[Violentmonkey](https://violentmonkey.github.io/)!

## Features

### Hotkeys

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

### Rich text comment box

### Prefetch hinting

- [prefetch hinting][mdn-prefetch-faq] for next chapters/works/index pages. As
  of otwarchive v0.9.336.10 this has no effect due to cache policy response
  headers, but it should make the reading experience smoother in the future.

## Experiments

- an experiment to parse metadata from work pages. **This does not send any data
  to anyone.** You can view what's been parsed in the browser console as
  `document.AO3_work_data`.

[mdn-prefetch-faq]:
	https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
