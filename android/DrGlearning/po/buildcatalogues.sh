#!/bin/sh
> ../assets/www/resources/js/catalogueEN.js
echo "var catalogueEN = " >> ../assets/www/resources/js/catalogueEN.js
pojson convert messages catalogueEN.po >> ../assets/www/resources/js/catalogueEN.js
echo ";" >> ../assets/www/resources/js/catalogueEN.js 

> ../assets/www/resources/js/catalogueFR.js
echo "var catalogueFR = " >> ../assets/www/resources/js/catalogueFR.js
pojson convert messages catalogueFR.po >> ../assets/www/resources/js/catalogueFR.js
echo ";" >> ../assets/www/resources/js/catalogueFR.js 

> ../assets/www/resources/js/catalogueES.js
echo "var catalogueES = " >> ../assets/www/resources/js/catalogueES.js
pojson convert messages catalogueES.po >> ../assets/www/resources/js/catalogueES.js
echo ";" >> ../assets/www/resources/js/catalogueES.js 
