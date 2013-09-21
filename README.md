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

#### Editor options
You can set your preferred [XEMBED](http://standards.freedesktop.org/xembed-spec/xembed-spec-latest.html)-capable editor by changing the value of the command-key in $HOME/.config/edembed/edembed.conf. 
```
[General]
command=emacs --parent-id %x %f
```
Where %x represents the id of the window the editor will embed itself in and %f the name of a temporary file.

Try using `command=gvim --socketid %x %f` or `command=xterm -into %x -e "/usr/bin/your_favorite_editor %f"`.

You might want to disable tooblars, scrollbars, etc. in order to make the editor window less cramped.  

For Vim. Add the following to your .vimrc:
```
:set guioptions-=m   "remove menu bar
:set guioptions-=T   "remove toolbar
:set guioptions-=r   "remove right-hand scroll bar
```

For Emacs. Add the following to your .emacs:
```
(tool-bar-mode -1)   ;remove toolbar
(menu-bar-mode -1)   ;remove menu bar 
(scroll-bar-mode -1) ;remove scroll bar
```

#### Other options

Options in firefox can be changed by going to `about:config` and using "edembed" as the search term, while Chromium users can bring up the console by pressing `Ctrl-Shift-J` and modify the `localStorage` dictionary.

The options should be mostly self-explanatory. The entries starting with `suffixes.` and `blacklist.` are used to match the id-property of textareas.  

## TODO
* create a control panel
