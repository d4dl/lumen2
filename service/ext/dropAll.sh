#!/bin/bash
MUSER="$1"
MPASS="$2"
MHOST="$3"
MDB="$4"
 
# Detect paths
MYSQL=$(which mysql)
AWK=$(which awk)
GREP=$(which grep)
 
if [ $# -ne 4 ]
then
  echo "Usage: $0 {MySQL-User-Name} {MySQL-User-Password} {MySQL-Database-Host} {MySQL-Database-Name}"
  echo "Drops all tables from a MySQL"
  exit 1
fi
echo $MYSQL -u$MUSER -p$MPASS -h$MHOST $MDB -e "drop table $t"
 
TABLES=$($MYSQL -u$MUSER -p$MPASS -h$MHOST $MDB -e 'show tables' | $AWK '{ print $1}' | $GREP -v '^Tables' )
 
for t in $TABLES
do
  echo "Deleting $t table from $MDB database..."
  $MYSQL -u$MUSER -p$MPASS -h$MHOST $MDB -e "drop table $t"
done

