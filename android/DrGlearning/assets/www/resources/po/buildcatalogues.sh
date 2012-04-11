#!/bin/sh
> ../js/catalogueEN.js
echo "var catalogueEN = " >> ../js/catalogueEN.js
pojson convert messages catalogueEN.po >> ../js/catalogueEN.js
echo ";" >> ../js/catalogueEN.js 
