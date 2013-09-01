window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    XULEdembedChrome.BrowserOverlay.init();
},false);

if ("undefined" == typeof(XULEdembedChrome)) {
  var XULEdembedChrome = {};
};


XULEdembedChrome.BrowserOverlay = {
    edembed_enabled: true, 

    replaceTextareas: function () {
        var textareas = content.document.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            var parent = textNode.parentNode;
            var edembedNode = XULEdembedChrome.BrowserOverlay.pluginNode(textNode);
            parent.insertBefore(edembedNode, textNode);

            // so we have a way of restoring their original state
            textNode.edembed_hidden_bak = textNode.hidden;
            textNode.edembed_display_bak = textNode.style.display;

            // hide it
            textNode.hidden = "true";
            textNode.style.display = "none";
            textNode.form.addEventListener("submit", function(){textNode.value = edembedNode.text;});
        }
    },

    restoreTextareas: function () {
        var textareas = content.document.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            textNode.hidden = textNode.edembed_hidden_bak;
            textNode.style.display = textNode.edembed_display_bak;
            textNode.form.removeEventListener("submit", function(){textNode.value = edembedNode.text;}); // FIXME maybe
        }

        var objects = content.document.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var objectNode = objects.item(i);
            if (objectNode.type === "application/x-edembed") {
                objectNode.parentNode.removeChild(objectNode);
            }
        }
    },

    pluginNode: function(textarea) {
        var node = content.document.createElement('object');
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
            var page = aEvent.originalTarget;
            // ugly workaround for a kb-focus issue
            page.addEventListener("focus", XULEdembedChrome.BrowserOverlay.focus);
            page.addEventListener("blur", XULEdembedChrome.BrowserOverlay.blur);

            XULEdembedChrome.BrowserOverlay.replaceTextareas(page);
        }
    },

    focus: function(aEvent) {
        var page = aEvent.originalTarget;
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = XPCNativeWrapper.unwrap(objects.item(i));
            edembed.pageFocus();
        }
    },

    blur: function(aEvent) {
        var page = aEvent.originalTarget;
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = XPCNativeWrapper.unwrap(objects.item(i));
            edembed.pageBlur();
        }
    },

    toggle: function(aEvent) {
        var page = aEvent.originalTarget;
        XULEdembedChrome.BrowserOverlay.edembed_enabled = !XULEdembedChrome.BrowserOverlay.edembed_enabled;

        var button = document.getElementById("edembed-toggle");
        if (XULEdembedChrome.BrowserOverlay.edembed_enabled === true) {
            // ugly workaround for a kb-focus issue
            page.addEventListener("focus", XULEdembedChrome.BrowserOverlay.focus);
            page.addEventListener("blur", XULEdembedChrome.BrowserOverlay.blur);

            XULEdembedChrome.BrowserOverlay.replaceTextareas();
            
            button.image = "chrome://edembed/content/enabled.png";
        } else {
            // ugly workaround for a kb-focus issue
            page.removeEventListener("focus", XULEdembedChrome.BrowserOverlay.focus);
            page.removeEventListener("blur", XULEdembedChrome.BrowserOverlay.blur);

            XULEdembedChrome.BrowserOverlay.restoreTextareas();

            button.image = "chrome://edembed/content/disabled.png";
        }
    }

};
