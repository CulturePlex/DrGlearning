#!/bin/sh
xgettext --keyword=translate --keyword=translate:1,2 --from-code utf-8 -L Perl `find ../assets/www/ -iname "*.js"` --package-name=drglearning --package-version=0.2.2 -o en.po
