# AO3 Enhancement Suite

## Install

If you have a userscript extension installed,
[click here to install.](https://raw.githubusercontent.com/legowerewolf/enhance-ao3/main/ao3-helpers.user.js)

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

The comment field on works is now the same rich text editor as is available when
posting works.

### Prefetch hinting

[Prefetch hinting][mdn-prefetch-faq] is a way to tell the browser what the next
page is likely to be, so that it can start loading it in the background. The
script adds prefetch hints for the next chapter in a work, the next work in a
series, and the next page of works in an index page.

As of otwarchive v0.9.336.10 this has no effect due to cache policy response
headers, but it should make the reading experience smoother in the future.

## Experiments

These may be features that are not yet ready for prime time, or were made
because they were cool without a clear use case.

### Work metadata parsing

When a work page loads, the script will attempt to parse the metadata from the
work header. **This does not send any data to anyone.** You can view what's been
parsed in the browser console as `document.AO3_work_data`.

[mdn-prefetch-faq]:
	https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ
