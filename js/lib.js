if ("undefined" == typeof(Edembed)) {
    var Edembed = {};
};

Edembed.Shared = {
    enabled: true,

    replaceTextareas: function () {
        var textareas = Edembed.Shared.document().getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            var parent = textNode.parentNode;
            var edembedNode = Edembed.Shared.pluginNode(textNode);
            
            if (textNode.clientHeight >= Edembed.Shared.load("min_height") && 
                //don't bother firing up an editor unless the textarea is of a certain height
                !Edembed.Shared.load("blacklist." + textNode.id)) {
                //or if it's blacklisted

                parent.insertBefore(edembedNode, textNode);

                // so we have a way of restoring their original state
                textNode.edembed_hidden_bak = textNode.hidden;
                textNode.edembed_display_bak = textNode.style.display;

                // hide it
                textNode.hidden = "true";
                textNode.style.display = "none";
            }
        }
    }, 

    restoreTextareas: function () {
        var textareas = Edembed.Shared.document().getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            if ("edembed_hidden_bak" in textNode) { //some textares are left alone
                textNode.hidden = textNode.edembed_hidden_bak;
                textNode.style.display = textNode.edembed_display_bak;
            }
        }

        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var objectNode = objects.item(i);
            if (objectNode.type === "application/x-edembed") {
                objectNode.parentNode.removeChild(objectNode);
            }
        }
    },

    pluginNode: function(textarea) {
        var node = Edembed.Shared.unwrap(Edembed.Shared.document().createElement('object'));
        for (var j = 0; j < textarea.attributes.length; j++)
            node.setAttribute(textarea.attributes.item(j).name, textarea.attributes.item(j).value);
        node.type = "application/x-edembed";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edembed_" + textarea.name;
        node.id = "edembed_" + textarea.id;

        var suffix = Edembed.Shared.load("suffixes." + textarea.id);
        if (!suffix) 
            node.setAttribute("suffix", Edembed.Shared.load("default_suffix"));
        else 
            node.setAttribute("suffix", suffix);

        node.setAttribute("textarea_id", "" + textarea.id);
        node.setAttribute("originalText", textarea.value);
        return node;
    },

    onPageLoad: function(aEvent) {
        var page = Edembed.Shared.window(aEvent);
        var forms = Edembed.Shared.document().getElementsByTagName("form");
        for (var i = 0; i < forms.length; i++) {
            var form = Edembed.Shared.unwrap(forms.item(i));
            form.addEventListener("submit", function() {Edembed.Shared.onSubmit(form)});
        }

        // ugly workaround for a kb-focus issue
        page.addEventListener("focus", Edembed.Shared.focus);
        page.addEventListener("blur", Edembed.Shared.blur);


        if (Edembed.Shared.enabled === true) {
            Edembed.Shared.replaceTextareas();
        }
    },

    onSubmit: function(form) {
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var object = Edembed.Shared.unwrap(objects.item(i));          
            if (object.type === "application/x-edembed") {
                var textarea_id = object.getAttribute("textarea_id");
                var textarea = Edembed.Shared.unwrap(Edembed.Shared.document().getElementById(textarea_id));
                textarea.value = object.text;
            }
        }
     },

    focus: function(aEvent) {
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var object = Edembed.Shared.unwrap(objects.item(i));
            if (object.type === "application/x-edembed")
                object.pageFocus();
        }
    },

    blur: function(aEvent) {
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var object = Edembed.Shared.unwrap(objects.item(i));
            if (object.type === "application/x-edembed")
                object.pageBlur();
        }
    },

    unwrap: function(node) {
        return node;
    },

    document: function() {
        return document;
    },

    window: function() {
        return window;
    },

    save: function(name, value) {
        throw "not implemented";
    },

    load: function(name) {
        throw "not implemented";
    }, 

};
