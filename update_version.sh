#!/bin/bash

if (( $# != 1 )) ; then
    echo $0 version
    exit 1
fi

VER=$1

perl -pi -e "s/^Version=.*/Version=$VER/" xpi/application.ini
perl -pi -e "s/<em:version>.*<\/em:version>/<em:version>$VER<\/em:version>/" xpi/install.rdf
perl -pi -e "s/\"version\": \"0.1\",/\"version\": \"$VER\",/" crx/manifest.json 
