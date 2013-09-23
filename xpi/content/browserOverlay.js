window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    Edembed.Mozilla.init();
},false);

if ("undefined" == typeof(Edembed)) {
    var Edembed = {};
};


Edembed.Mozilla = Edembed.Shared; 

/*
*
* Mozilla-specific functions
*
*/

Edembed.Mozilla.init = function() {
    // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
    if(gBrowser) 
        gBrowser.addEventListener("DOMContentLoaded", Edembed.Shared.onPageLoad, false);

    var firstRun = "extensions.edembed.first_run";
    if (Application.prefs.getValue(firstRun, false)) {
        Application.prefs.setValue(firstRun, false);
        
        // enable the addon-bar in order to show the "toggle-button" 
        // this is kind of rude, so we only do this once
        var addonbar = document.getElementById("addon-bar");
        addonbar.setAttribute("collapsed", false);
        document.persist(addonbar.id, "collapsed");
    }
}

Edembed.Mozilla.toggle = function(aEvent) {
    var page = aEvent.originalTarget;
    Edembed.Shared.enabled = !Edembed.Shared.enabled;

    var button = document.getElementById("edembed-toggle");
    if (Edembed.Shared.enabled === true) {
        Edembed.Shared.replaceTextareas();
            
        button.image = "chrome://edembed/content/enabled.png";
    } else {
        Edembed.Shared.restoreTextareas();

        button.image = "chrome://edembed/content/disabled.png";
    }
}

Edembed.Mozilla.unwrap = function(node) {
    return XPCNativeWrapper.unwrap(node);
}

Edembed.Mozilla.document = function() {
    return content.document;
}

Edembed.Mozilla.window = function(event) {
    return event.originalTarget;
}

Edembed.Mozilla.save = function(name, value) {
    Application.prefs.setValue("extensions.edembed." + name, value);
}

Edembed.Mozilla.load = function(name) {
    return Application.prefs.getValue("extensions.edembed." + name, undefined);
}

Edembed.Mozilla.pref_child_keys = function(branch) {
    var pref_branch = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService);
    pref_branch = pref_branch.getBranch("extensions.edembed." + branch + ".");
    var outval = [];
    return pref_branch.getChildList("", outval);
}
