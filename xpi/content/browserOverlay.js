window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    XULEdembedChrome.BrowserOverlay.init();
},false);

if ("undefined" == typeof(XULEdembedChrome)) {
  var XULEdembedChrome = {};
};


XULEdembedChrome.BrowserOverlay = {
    edembed_enabled: true, 

    replaceTextareas: function (page) {
        var textareas = page.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            var parent = textNode.parentNode;
            var edembedNode = XULEdembedChrome.BrowserOverlay.pluginNode(page, textNode);
            parent.insertBefore(edembedNode, textNode);
            textNode.hidden = true;
            textNode.style.display = "none";
            textNode.form.addEventListener("submit", function(){textNode.value = edembedNode.text;});
        }
    },

    pluginNode: function(page, textarea) {
        var node = page.createElement('object');
        for (var j = 0; j < textarea.attributes.length; j++)
            node.setAttribute(textarea.attributes.item(j).name, textarea.attributes.item(j).value);
        node.type = "application/x-edembed";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edembed_" + textarea.name;
        node.id = "edembed_" + textarea.id;
        node.setAttribute("originalText", textarea.value);
        return XPCNativeWrapper.unwrap(node);
    },

    init: function() {
        // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        if(gBrowser) 
            gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);

        var firstRun = "extensions.edembed.firstRun";
        if (Application.prefs.getValue(firstRun, false)) {
            Application.prefs.setValue(firstRun, false);
            
            // enable the addon-bar in order to show the "toggle-button" 
            // this is kind of rude, so we only do this once
            var addonbar = document.getElementById("addon-bar");
            addonbar.setAttribute("collapsed", false);
            document.persist(addonbar.id, "collapsed");
        }
    },

    onPageLoad: function(aEvent) {
        if (XULEdembedChrome.BrowserOverlay.edembed_enabled === true) {
            var page = aEvent.originalTarget; // doc is document that triggered the event
            page.addEventListener("focus", XULEdembedChrome.BrowserOverlay.focus);
            page.addEventListener("blur", XULEdembedChrome.BrowserOverlay.blur);

            XULEdembedChrome.BrowserOverlay.replaceTextareas(page);
        }
    },

    focus: function(aEvent) {
        var page = aEvent.originalTarget;
        //alert(page);
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = XPCNativeWrapper.unwrap(objects.item(i));
            edembed.pageFocus();
        }
    },

    blur: function(aEvent) {
        var page = aEvent.originalTarget;
        //alert(page);
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = XPCNativeWrapper.unwrap(objects.item(i));
            edembed.pageBlur();
        }
    },

    toggle: function(aEvent) {
        XULEdembedChrome.BrowserOverlay.edembed_enabled = !XULEdembedChrome.BrowserOverlay.edembed_enabled;

        var button = document.getElementById("edembed-toggle");
        if (XULEdembedChrome.BrowserOverlay.edembed_enabled === true) {
            button.image = "chrome://edembed/content/enabled.png";
        } else {
            button.image = "chrome://edembed/content/disabled.png";
        }
    }

};
