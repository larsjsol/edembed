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

Edembed.Chromium.defaultOptions = function() {
    localStorage["min_height"] = 100;

    localStorage["default_suffix"] = ".edembed";
    localStorage["suffixes.wiki__text"] = ".dokuwiki";
    localStorage["suffixes.wpTextbox1"] = ".mediawiki";
    
    localStorage["blacklist.composebody"] = true; //roundcube webmail
    localStorage["textarea_DWT28"] = true; //zimbra6
}

Edembed.Chromium.defaultOptions();
chrome.runtime.onMessage.addListener(Edembed.Chromium.onMessage);
Edembed.Shared.onPageLoad();

