// ==UserScript==
// @name         Auto-purchase Free Books
// @version      0.3
// @updateURL    https://raw.githubusercontent.com/legowerewolf/Userscripts/master/Auto-purchase%20Free%20Books.user.js
// @downloadURL  https://raw.githubusercontent.com/legowerewolf/Userscripts/master/Auto-purchase%20Free%20Books.user.js
// @description  Automatically purchase free ebooks from Amazon and Google Play
// @author       legowerewolf
// @match        https://play.google.com/store/books/details*
// @match        https://play.google.com/store/epurchase*
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amazon.com/dp/*
// @match        https://www.amazon.com/kindle-dbs/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (location.host == "play.google.com") { //Google Play Store
        if (location.pathname.startsWith("/store/books")) { //Main book page
            if (document.getElementsByClassName("LkLjZd ScJHi HPiPcc IfEcue  ")[document.getElementsByClassName("LkLjZd ScJHi HPiPcc IfEcue  ").length-1].textContent.includes("Free Ebook")) {
                document.getElementsByClassName("LkLjZd ScJHi HPiPcc IfEcue  ")[document.getElementsByClassName("LkLjZd ScJHi HPiPcc IfEcue  ").length-1].click();
            }
        } else if (location.pathname.startsWith("/store/epurchase")) { //Modal pop-up confirmation
            var checkReady = setInterval(function() {
                if (document.getElementsByClassName("price") != null){
                    if (document.getElementsByClassName("price")[0].children[0].textContent == "$0.00" && document.getElementById("loonie-purchase-ok-button") != null) {
                        document.getElementById("loonie-purchase-ok-button").click();
                        console.log("Clicked purchase button");
                        clearInterval(checkReady);
                    }
                }
            }, 100);
        }
    } else if (location.host == "www.amazon.com"){ //Amazon.com eBooks
        if (window.location.href.includes("/dp/")) {
            if (document.getElementsByClassName("kindle-price")[0].children[1].textContent.includes("$0.00")) {
                document.getElementById("one-click-button").form.submit();
            }
        } else if (window.location.href.includes("/kindle-dbs/")) {
            document.querySelector(".a-button-input").click();
        }
    }
})();