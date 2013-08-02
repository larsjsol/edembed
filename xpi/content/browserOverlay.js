window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    XULEdowserChrome.BrowserOverlay.init();  
},false);

if ("undefined" == typeof(XULEdowserChrome)) {
  var XULEdowserChrome = {};
};


XULEdowserChrome.BrowserOverlay = {
    replaceTextareas: function (page) {        
        var textareas = page.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            var parent = textNode.parentNode;
            var edowserNode = XULEdowserChrome.BrowserOverlay.pluginNode(page, textNode);
            parent.insertBefore(edowserNode, textNode);
            textNode.hidden = true; 
            textNode.style.display = "none";
            textNode.form.addEventListener("submit", function(){textNode.value = edowserNode.text;});
        }
    },
    
    pluginNode: function(page, textarea) {
        var node = page.createElement('object');
        for (var j = 0; j < textarea.attributes.length; j++)
            node.setAttribute(textarea.attributes.item(j).name, textarea.attributes.item(j).value);
        node.type = "application/x-edowser";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edowser_" + textarea.name;
        node.id = "edowser_" + textarea.id;
        node.setAttribute("originalText", textarea.value);
        return XPCNativeWrapper.unwrap(node);
    }, 

    init: function() {
        // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    },

    onPageLoad: function(aEvent) {
        var page = aEvent.originalTarget; // doc is document that triggered the event
        page.addEventListener("focus", XULEdowserChrome.BrowserOverlay.focus);
        page.addEventListener("blur", XULEdowserChrome.BrowserOverlay.blur);

        XULEdowserChrome.BrowserOverlay.replaceTextareas(page);
    },

    focus: function(aEvent) {
        var page = aEvent.originalTarget;
        //alert(page);
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edowser = XPCNativeWrapper.unwrap(objects.item(i));
            edowser.pageFocus();
        }
    },

    blur: function(aEvent) {
        var page = aEvent.originalTarget;
        //alert(page);
        var objects = page.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edowser = XPCNativeWrapper.unwrap(objects.item(i));
            edowser.pageBlur();
        }
    }

    
};

