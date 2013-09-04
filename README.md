Edembed
=======
Edembed is a Firefox and Chromium extension that lets you use an editor to edit `<textarea>`s. 

Important: Remember to use the editors save function before you press the submit/save/send button.

A pre-compiled version of the Firefox extension is available from [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/edembed/).

## Compiling
Make sure you have the following installed:

* Qt4
* libXi
* git
* git-mercurial
* openssl (to sign the chromium extension)

You can download and build edembed by running:
```
git clone https://github.com/larsjsol/edembed.git
cd edembed
make
```
And answering the questions asked by openssl when it creates a signing-key.

This will create a Firefox extension (edembed.xpi) and a Chromium extension (edembed.crx). 

## Installing

### Firefox
1. Go to `about:addons`
2. Click the wrench-icon,  choose "Install Add-on From File..." and find edembed.xpi

### Chromium
1. Go to `chrome://extensions/`
2. Drag and drop edembed.crx from a file manager into the browser window

### Configuring

The default config file looks like this:
```
[General]
command=emacs --parent-id %x %f
```
Where %x represents the id of the window the editor will embed itself in and %f the name of a temporary file.

You can set your preferred [XEMBED](http://standards.freedesktop.org/xembed-spec/xembed-spec-latest.html)-capable editor by changing the value of the command-key in $HOME/.config/edembed/edembed.conf. 

Try using `command=gvim --socketid %x %f` or `command=xterm -into %x -e "/usr/bin/your_favorite_editor %f"`.

## TODO
* create a control panel
