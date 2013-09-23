if ("undefined" == typeof(Edembed)) {
    var Edembed = {};
};

Edembed.Chromium = Edembed.Shared;

/*
*
* Chromium-specific functions
*
*/

Edembed.Chromium.onMessage = function(request, sender, sendResponse) {

    if ("enabled" in request && request.enabled != Edembed.Shared.enabled) {
        Edembed.Shared.enabled = request.enabled;
        if (Edembed.Shared.enabled) {
            Edembed.Shared.replaceTextareas();
        } else {
            Edembed.Shared.restoreTextareas();
        }
    }
}

Edembed.Chromium.save = function(name, value) {
    localStorage[name] = value;
}

Edembed.Chromium.load = function(name) {
    return localStorage[name];
}

Edembed.Chromium.pref_child_keys = function(branch) {
    var children = [];
    branch = branch + ".";
    for (var key in localStorage) {
        if (key.substring(0, branch.length) === branch) {
            children.push(key.substring(branch.length));
        }
    }
    return children;
}

Edembed.Chromium.defaultOptions = function() {
    if (!("first_run" in localStorage)) {
        localStorage["first_run"] = false;
        localStorage["min_height"] = 100;

        localStorage["default_suffix"] = ".edembed";
        localStorage["suffixes.^wiki__text$"] = ".dokuwiki";
        localStorage["suffixes.^wpTextbox1$"] = ".mediawiki";
    
        localStorage["blacklist.^composebody$"] = true; //roundcube webmail
        localStorage["blacklist.^textarea_DWT\\d+$"] = true; //zimbra6
    }
}

Edembed.Chromium.defaultOptions();
chrome.runtime.onMessage.addListener(Edembed.Chromium.onMessage);
Edembed.Shared.onPageLoad();

