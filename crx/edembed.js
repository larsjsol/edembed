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
            
            window.addEventListener("focus", Edembed.Shared.focus);
            window.addEventListener("blur", Edembed.Shared.blur);

            Edembed.Shared.replaceTextareas();
        } else {
            window.removeEventListener("focus", Edembed.Shared.focus);
            window.removeEventListener("blur", Edembed.Shared.blur);
                
            Edembed.Shared.restoreTextareas();
        }
    }
}

chrome.runtime.onMessage.addListener(Edembed.Chromium.onMessage);
Edembed.Shared.onPageLoad();

