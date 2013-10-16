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
            var blacklisted = Edembed.Shared.load_match(textNode.id, "blacklist");
            var whitelisted = Edembed.Shared.load_match(textNode.id, "whitelist");
 
           if (textNode.clientHeight >= Edembed.Shared.load("min_height") && 
                //don't bother firing up an editor unless the textarea is of a certain height
               (whitelisted || !blacklisted)) {
                //or if it's blacklisted

                parent.insertBefore(edembedNode, textNode);

                // so we have a way of restoring their original state
                textNode.edembed_hidden_bak = textNode.hidden;
                textNode.edembed_display_bak = textNode.style.display;

                // hide it
                textNode.hidden = "true";
                textNode.style.display = "none";

               var form = Edembed.Shared.unwrap(textNode.form);
               var inputs = Edembed.Shared.unwrap(form.getElementsByTagName('input'));
               for (var i = 0; i < inputs.length; i++) {
                   if (inputs.item(i).type == 'submit') {
                       inputs.item(i).addEventListener("click", function(event) {
                           event = Edembed.Shared.unwrap(event);
                           Edembed.Shared.onClick(event.target);
                       });
                   }
               }
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
        node.type = "application/x-edembed";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edembed_" + textarea.name;
        node.id = "edembed_" + textarea.id;

        var suffix = Edembed.Shared.load_match(textarea.id, "suffixes");
        if (!suffix) 
            node.setAttribute("suffix", Edembed.Shared.load("default_suffix"));
        else 
            node.setAttribute("suffix", suffix);

        node.setAttribute("textarea_id", "" + textarea.id);
        node.setAttribute("originalText", textarea.value);
        return node;
    },

    onPageLoad: function(aEvent) {
        // ugly workaround for a kb-focus issue
        var page = Edembed.Shared.window(aEvent);
        page.addEventListener("focus", Edembed.Shared.focus);
        page.addEventListener("blur", Edembed.Shared.blur);


        if (Edembed.Shared.enabled === true) {
            Edembed.Shared.replaceTextareas();
        }
    },

    onClick: function(button) { 
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var object = Edembed.Shared.unwrap(objects.item(i));          
            if (object.type === "application/x-edembed") {
                var textarea_id = object.getAttribute("textarea_id");
                var textarea = Edembed.Shared.unwrap(Edembed.Shared.document().getElementById(textarea_id));
                object.onSubmit();
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

    load_match: function(string, branch) {
        var children = Edembed.Shared.pref_child_keys(branch);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            regexp = new RegExp(child);
            if (regexp.test(string))
                return Edembed.Shared.load(branch + "." + child);
        }
        return undefined;
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

    pref_child_keys: function(branch) {
        throw "not implemented";
    }

};
