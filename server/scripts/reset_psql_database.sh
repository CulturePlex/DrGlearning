#!/bin/sh
#Tested on Ubuntu 11.10 with postgresql-9.1-postgis
echo "Droping database"
dropdb drglearning
echo "Creating database"
createdb drglearning
echo "Creating lan plpsql"
createlang plpgsql drglearning
echo "Processing postgis.sql"
psql -f drglearning -f  /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
echo "Procesing spatial_ref_sys.sql"
psql -f drglearning -f  /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql
