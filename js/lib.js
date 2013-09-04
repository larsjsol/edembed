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
            
            //don't bother firing up an editor unless the textarea is of a certain height
            if (textNode.clientHeight > 100) {
                parent.insertBefore(edembedNode, textNode);

                // so we have a way of restoring their original state
                textNode.edembed_hidden_bak = textNode.hidden;
                textNode.edembed_display_bak = textNode.style.display;

                // hide it
                textNode.hidden = "true";
                textNode.style.display = "none";
                textNode.form.addEventListener("submit", function(){textNode.value = edembedNode.text;});
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
                textNode.form.removeEventListener("submit", function(){textNode.value = edembedNode.text;}); // FIXME maybe
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
        var node = Edembed.Shared.document().createElement('object');
        for (var j = 0; j < textarea.attributes.length; j++)
            node.setAttribute(textarea.attributes.item(j).name, textarea.attributes.item(j).value);
        node.type = "application/x-edembed";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edembed_" + textarea.name;
        node.id = "edembed_" + textarea.id;
        node.setAttribute("originalText", textarea.value);
        return Edembed.Shared.unwrap(node);
    },

    onPageLoad: function(aEvent) {
        if (Edembed.Shared.enabled === true) {
            var page = Edembed.Shared.window(aEvent);
            // ugly workaround for a kb-focus issue
            page.addEventListener("focus", Edembed.Shared.focus);
            page.addEventListener("blur", Edembed.Shared.blur);

            Edembed.Shared.replaceTextareas();
        }
    },

    focus: function(aEvent) {
        var page = Edembed.Shared.window(aEvent);
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = Edembed.Shared.unwrap(objects.item(i));
            edembed.pageFocus();
        }
    },

    blur: function(aEvent) {
        var page = Edembed.Shared.window(aEvent);
        var objects = Edembed.Shared.document().getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = Edembed.Shared.unwrap(objects.item(i));
            edembed.pageBlur();
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
    }

};



