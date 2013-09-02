var Edembed = {
    enabled: true, 

    replaceTextareas: function () {
        var textareas = document.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            var parent = textNode.parentNode;
            var edembedNode = Edembed.pluginNode(textNode);

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
        var textareas = document.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            var textNode = textareas.item(i);
            if ("edembed_hidden_bak" in textNode) { //some textares are left alone
                textNode.hidden = textNode.edembed_hidden_bak;
                textNode.style.display = textNode.edembed_display_bak;
                textNode.form.removeEventListener("submit", function(){textNode.value = edembedNode.text;}); // FIXME maybe
            }
        }

        var objects = document.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var objectNode = objects.item(i);
            if (objectNode.type === "application/x-edembed") {
                objectNode.parentNode.removeChild(objectNode);
            }
        }
    },

    pluginNode: function(textarea) {
        var node = document.createElement('object');
        for (var j = 0; j < textarea.attributes.length; j++)
            node.setAttribute(textarea.attributes.item(j).name, textarea.attributes.item(j).value);
        node.type = "application/x-edembed";
        node.height = textarea.clientHeight;
        node.width = textarea.clientWidth;
        node.name = "edembed_" + textarea.name;
        node.id = "edembed_" + textarea.id;
        node.setAttribute("originalText", textarea.value);
        return node;
    },

    onPageLoad: function() {
        chrome.runtime.onMessage.addListener(Edembed.onMessage);

        if (Edembed.enabled === true) {
            // ugly workaround for a kb-focus issue
            window.addEventListener("focus", Edembed.focus);
            window.addEventListener("blur", Edembed.blur);

            Edembed.replaceTextareas();
        }
    },

    focus: function(aEvent) {
        var objects = document.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = objects.item(i);
            edembed.pageFocus();
        }
    },

    blur: function(aEvent) {
        var objects = document.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var edembed = objects.item(i);
            edembed.pageBlur();
        }
    },


    onMessage: function(request, sender, sendResponse) {

        if ("enabled" in request && request.enabled != Edembed.enabled) 
        {
            Edembed.enabled = request.enabled;
            if (Edembed.enabled) {
                
                window.addEventListener("focus", Edembed.focus);
                window.addEventListener("blur", Edembed.blur);

                Edembed.replaceTextareas();
            } else {
                window.removeEventListener("focus", Edembed.focus);
                window.removeEventListener("blur", Edembed.blur);
                
                Edembed.restoreTextareas();
            }
        }
    }
};

Edembed.onPageLoad();

