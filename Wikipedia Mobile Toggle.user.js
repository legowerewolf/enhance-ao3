// ==UserScript==
// @name         Wikipedia Mobile Toggle
// @version      0.2
// @updateURL    https://github.com/legowerewolf/Userscripts/raw/master/Wikipedia%20Mobile%20Toggle.user.js
// @downloadURL  https://github.com/legowerewolf/Userscripts/raw/master/Wikipedia%20Mobile%20Toggle.user.js
// @description  Switch back and forth between mobile and desktop based on screen width.
// @author       legowerewolf
// @match        https://en.wikipedia.org/*
// @match        https://en.m.wikipedia.org/*
// @grant        none
// ==/UserScript==


if (location.host == "en.m.wikipedia.org"){
    Array.from(document.querySelectorAll("h2.collapsible-heading:not(.open-block)")).forEach((element) => {element.click();});
}

var headings = Array.from(document.querySelectorAll("span.mw-headline"));

function changeHashWithoutScrolling(hash) {
    var id = hash.replace(/^.*#/, ''),
        elem = document.getElementById(id)
    elem.id = id+'-tmp'
    window.location.hash = hash
    elem.id = id
}

function checkResize() {
    if (location.host == "en.wikipedia.org" && window.innerWidth < 600) {
        location.host = "en.m.wikipedia.org";
    } else if (location.host == "en.m.wikipedia.org" && window.innerWidth >= 600) {
        location.host = "en.wikipedia.org";
    }
}

function updateLocation() {
    var heading;
    headings.forEach((element) => {
        if (element.getBoundingClientRect().top < 200) {
            heading = element;
        }
    });

    if (heading != undefined) {
        changeHashWithoutScrolling(heading.id);
    } else {
        location.hash = "";
    }
}

window.addEventListener("scroll", updateLocation);
window.addEventListener("resize", checkResize);