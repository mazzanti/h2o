#!/usr/bin/bash

#
# Welcome to installer of jstest
# Copyright (C) 2016 Giulio Mazzanti - mazzantibox@gmail.com
#

$DIR = "/var/www/jstest";
$TMPDIR = "/var/tmp/installjstest";
$DB_HOST = "127.0.0.1";
$DB_PORT = "3386";
$DB_USER = "root";
$DB_PASSWD = "";
$VERSION = "2";

# If exists backup previous dir and database
echo "Backup previous version...";
cp $DIR $DIR + "_bak";
#zip $DIR;
#mysqldump

# Check new version online
#echo "Checking updates...";
#curl www.test.com

# Extract to temp folder
mkdir $TMPDIR
#unzip -o setup.zip -d $TMPDIR

# Copy file to php www root folder
echo "Copying files...";
#cp $TMPDIR $DIR;

# Load database
echo "Loading database...";
#mysql_import

# Delete temp folder
echo "Delete temp folder...";
#rmdir $TMPDIR;

# Setup complete
echo "Setup complete";
