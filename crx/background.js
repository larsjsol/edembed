
var enabled = true;

function toggle() {
    enabled = !enabled;
    chrome.tabs.query({}, function(tabs) {
                      for (var i = 0; i < tabs.length; i++) 
                          chrome.tabs.sendMessage(tabs[i].id, {"enabled": enabled})
    
    })
    if (enabled)
        chrome.browserAction.setIcon({path:"enabled.png"});
    else 
        chrome.browserAction.setIcon({path:"disabled.png"});
}


chrome.browserAction.onClicked.addListener(toggle);
