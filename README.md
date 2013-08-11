edembed
=======
Edembed is a firefox extension that lets you use an editor to edit `<textarea>`s. 

## Compiling from source
Make sure you have the following installed:

* Qt4
* libXi
* git
* git-mercurial

You can then build edembed by running:
```
git clone https://github.com/larsjsol/edembed.git
cd edembed
make
```

## Installation
1. In Firefox: Open the Add-ons Manager by choosing "Add-ons" from the Tools menu
2. Click the wrench,  choose "Install Add-on From File..." and find edembed.xpi
3. Set your preferred [XEMBED](http://standards.freedesktop.org/xembed-spec/xembed-spec-latest.html)-capable editor by changing the value of the command-key in $HOME/.config/edembed/edembed.conf. 
4. Remember to save the file before you press submit.

The default config file looks like this:
```
[General]
command=emacs --parent-id %x %f
```
Where %x represents the id of the window the editor will embed itself in and %f the name of a temporary file.

Try using `command=gvim --socketid %x %f` or `command=xterm -into %x -e "/usr/bin/your_favorite_editor %f"`.


## TODO
* add site-specific file-endings which will help editors do syntax-highlighting
* create a control panel
* package crome extension
