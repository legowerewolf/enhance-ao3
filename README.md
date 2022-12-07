# Miscellaneous userscripts and bookmarks

## Userscripts

### ao3-helpers (functional, active maintenance)

Adds hotkeys to AO3 for:

- navigation on works, between works in a series, and on index pages (left/right
  arrow keys)
- bookmarking a work or series (`b`)
- recommending a work or series (`r`)
- subscribing to a work, series, or author (`s`)
- kudosing a work (`l`)
- saving a work to Pocket (`p`)

Also includes an experiment to parse metadata from work pages. **This does not
send any data to anyone.**

### link-sanitizer (functional, in-development)

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
