#!/usr/bin/bash
# setup environment for h2o
# Giulio Mazzanti - mazzantibox@gmail.com

TIME=`date +%Y%m%d%H%M%S`

sudo apt-get install nodejs
# npm
sudo npm install -g jshint
sudo npm install -g minifier
sudo npm install -g babel
sudo npm install -g obfuscator
sudo npm install -g js-obfuscator
sudo npm install -g packer
