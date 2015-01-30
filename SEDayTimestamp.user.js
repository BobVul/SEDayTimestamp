// ==UserScript==
// @name          SEDayTimestamp
// @namespace     http://vulpin.com/
// @description   Prepends a day name to the SE UTC timestamps
// @match         *://*.askubuntu.com/*
// @match         *://*.mathoverflow.net/*
// @match         *://*.onstartups.com/*
// @match         *://*.serverfault.com/*
// @match         *://*.stackapps.com/*
// @match         *://*.stackexchange.com/*
// @match         *://*.stackoverflow.com/*
// @match         *://*.superuser.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js
// @version       1.0.2
// @grant         none
// ==/UserScript==

(function() {
var Program = {
    main: function() {
        window.removeEventListener('load', mainEventListener, false);
        
        var observer = new MutationObserver(function(mutations, observer) {
            // y'know what? MutationObserver sucks.
            // it doesn't give every modified node, just the top of a tree of modified nodes
            mutations.forEach(function(mutation) {
                Array.prototype.forEach.call(mutation.addedNodes, Program.processDescendants);
            });
        });
        
        observer.observe(document, {
            subtree: true,
            childList: true
        });
        
        Program.processDescendants(document);
    },
    
    processDescendants: function(node) {
        var nodes = node.querySelectorAll('span.relativetime, span.relativetime-clean');
        
        Array.prototype.forEach.call(nodes, function(node) {
            Program.processNode(node);
        });
    },
    
    processNode: function(node) {
        if (node.title === undefined) {
            // no date?
            return;
        }
        
        if (node.timestamp !== undefined) {
            // already processed
            return;
        }
        
        // Save the existing timestamp (marker that it's already processed).
        // The title text is in the format YYYY-MM-DD HH:mm:ssZ
        node.timestamp = node.title;
        
        // use moment.js because native Date is useless
        // might use stricter parse mode later
        var date = moment(node.timestamp);
        
        // tell moment.js to use UTC times when formatting
        date.utc();
        
        node.title = date.format('ddd, YYYY-MM-DD HH:mm:ss[Z]');
    }
};

var mainEventListener = Program.main.bind(Program);

window.addEventListener('load', mainEventListener, false);
})();