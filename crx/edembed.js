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

chrome.runtime.onMessage.addListener(Edembed.Chromium.onMessage);
Edembed.Shared.onPageLoad();

