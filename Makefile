SHELL = /bin/bash

all: edowser.xpi

edowser.xpi: $(wildcard xpi/*) xpi/plugins/libedowser.so
	cd xpi; zip edowser $$(/usr/bin/find .)
	mv xpi/edowser.zip edowser.xpi

xpi/plugins/libedowser.so:  plugin/libedowser.so
	mkdir -p xpi/plugins/
	cp plugin/libedowser.so xpi/plugins/libedowser.so

plugin/libedowser.so: $(wildcard plugin/*.h) $(wildcard plugin/*.cpp) $(wildcard plugin/.*pro) submodules
	cd plugin; qmake; make

submodules: manymouse/README.txt qt-solutions/qtbrowserplugin/README.TXT

manymouse/README.txt: 
	rmdir --ignore-fail-on-non-empty manymouse
	git-hg clone http://hg.icculus.org/icculus/manymouse/

qt-solutions/qtbrowserplugin/README.TXT: submodule_init

submodule_init: manymouse/README.txt
	git submodule init
	git submodule update

.PHONY: clean
clean:
	touch xpi/edowser.zip; rm xpi/edowser.zip 
	touch edowser.xpi; rm edowser.xpi 
	touch xpi/plugins/libedowser.so; rm xpi/plugins/libedowser.so
	cd plugin; make clean
