SHELL = /bin/bash

all: edembed.xpi edembed.crx

edembed.xpi: $(wildcard xpi/*) $(wildcard xpi/content/*) xpi/plugins/libedembed.so xpi/content/lib.js
	cd xpi; zip edembed $$(/usr/bin/find .)
	mv xpi/edembed.zip edembed.xpi

xpi/plugins/libedembed.so: plugin/libedembed.so
	mkdir -p xpi/plugins/
	cp plugin/libedembed.so xpi/plugins/libedembed.so

xpi/content/lib.js: js/lib.js
	cp js/lib.js xpi/content/lib.js

edembed.crx: $(wildcard crx/*) crx/libedembed.so edembed.pem crx/lib.js
	bash pack_crx.sh crx/ edembed.pem

crx/libedembed.so: plugin/libedembed.so
	cp plugin/libedembed.so crx/libedembed.so

edembed.pem:
	openssl req -new -newkey rsa:1024 -days 365 -nodes -x509 -keyout edembed.pem

crx/lib.js: js/lib.js
	cp js/lib.js crx/lib.js

plugin/libedembed.so: $(wildcard plugin/*.h) $(wildcard plugin/*.cpp) $(wildcard plugin/.*pro) submodules
	cd plugin; qmake; make

submodules: manymouse/README.txt qt-solutions/qtbrowserplugin/README.TXT

manymouse/README.txt:
	if [ -d manymouse ]; then \
		rmdir --ignore-fail-on-non-empty manymouse; \
	fi
	git-hg clone http://hg.icculus.org/icculus/manymouse/

qt-solutions/qtbrowserplugin/README.TXT: submodule_init

submodule_init: manymouse/README.txt
	git submodule init
	git submodule update

.PHONY: clean
clean:
	touch xpi/edembed.zip; rm xpi/edembed.zip 
	touch edembed.xpi; rm edembed.xpi 
	touch xpi/plugins/libedembed.so; rm xpi/plugins/libedembed.so
	touch edembed.crx; rm edembed.crx
	touch crx/libedembed.so; rm crx/libedembed.so
	cd plugin; make clean
