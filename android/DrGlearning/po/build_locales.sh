#!/bin/sh

for LANG in ar en es_ES fr pt_BR
do
    echo "Generating" $LANG ":" ../assets/www/resources/js/locales/$LANG.js
    echo '// Locale '$LANG'
var i18n = new Jed({
    "locale_data": '`pojson convert -e utf-8 messages $LANG.po`',
    "domain": "messages",
    "plural_forms": "nplurals=2; plural=(n != 1);"
});' > ../assets/www/resources/js/locales/$LANG.js
done
