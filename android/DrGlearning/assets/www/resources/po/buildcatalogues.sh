#!/bin/sh
> ../js/catalogueEN.js
echo "var catalogueEN = " >> ../js/catalogueEN.js
pojson convert messages catalogueEN.po >> ../js/catalogueEN.js
echo ";" >> ../js/catalogueEN.js 

> ../js/catalogueFR.js
echo "var catalogueFR = " >> ../js/catalogueFR.js
pojson convert messages catalogueFR.po >> ../js/catalogueFR.js
echo ";" >> ../js/catalogueFR.js 

> ../js/catalogueES.js
echo "var catalogueES = " >> ../js/catalogueES.js
pojson convert messages catalogueES.po >> ../js/catalogueES.js
echo ";" >> ../js/catalogueES.js 
