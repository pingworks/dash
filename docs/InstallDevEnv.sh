#!/bin/bash

##########################################################
# Installationsscript (tested on Debian Wheezy)
##########################################################

SCMDVERSION=4.0.4.84
PHANTOMVERSION=1.9.0
SELENIUMURL=http://selenium-release.storage.googleapis.com/2.44/selenium-server-standalone-2.44.0.jar

apt-get update && apt-get upgrade -y
apt-get install -y vim less git wget zip unzip default-jre ant ant-contrib \
  ruby rubygems ruby-compass php5 php5-curl zendframework xvfb iceweasel phpunit phpunit-selenium

# Sources
mkdir -p /opt/app
cd /opt/app
git clone https://github.com/pingworks/dash.git dash

# Data
cd /tmp/
wget https://dash.pingworks.net/repo/master/1.9a440c6.233/artifacts/dash-tests-data_1+git.9a440c6-233_all.deb
dpkg -i dash-tests-data_*_all.deb

# /etc/hosts
IP=$(ip addr list eth0|grep 'inet '|cut -f6 -d' '|cut -f1 -d'/')
cat << EOF >> /etc/hosts
$IP dash dash-test dash-dev
EOF

# Apache
cat << EOF > /etc/apache2/sites-available/dash-dev
<VirtualHost *:80>
  ServerName dash-dev

  # Dash
  DocumentRoot /opt/app/dash/frontend
  SetEnv APPLICATION_ENV "development"

  <Directory /opt/app/dash/frontend>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} -s [OR]
    RewriteCond %{REQUEST_FILENAME} -l [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^.*$ - [NC,L]
    RewriteRule ^.*$ rest.php [NC,L]
  </Directory>
    
  Alias /rest.php /opt/app/dash/backend/public/rest.php
</VirtualHost>
EOF

cat << EOF > /etc/apache2/sites-available/dash
<VirtualHost *:80>
 ServerName dash

  DocumentRoot /opt/dash/public

  SetEnv APPLICATION_ENV "production"

  <Directory /opt/dash/public>
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>

</VirtualHost>
EOF

cat << EOF > /etc/apache2/sites-available/dash-test
<VirtualHost *:80>
 ServerName dash-test

  DocumentRoot /opt/dash/public

  SetEnv APPLICATION_ENV "testing"

  <Directory /opt/dash/public>
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>

</VirtualHost>
EOF

a2enmod rewrite
a2dissite 000-default
a2ensite dash-dev
a2ensite dash
a2ensite dash-test
/etc/init.d/apache2 restart

# Build Tools
cd /usr/share/ant/lib/
wget http://repo1.maven.org/maven2/org/vafer/jdeb/1.0.1/jdeb-1.0.1.jar
cd /tmp/
wget http://cdn.sencha.com/cmd/${SCMDVERSION}/SenchaCmd-${SCMDVERSION}-linux-x64.run.zip
unzip SenchaCmd-${SCMDVERSION}-linux-x64.run.zip
chmod 755 SenchaCmd-${SCMDVERSION}-linux-x64.run
./SenchaCmd-${SCMDVERSION}-linux-x64.run --prefix /opt
rm SenchaCmd-${SCMDVERSION}-linux-x64.run

# Tests
# phantomjs
cd /tmp/
wget https://phantomjs.googlecode.com/files/phantomjs-${PHANTOMVERSION}-linux-x86_64.tar.bz2
cd /opt
tar xvfj /tmp/phantomjs-${PHANTOMVERSION}-linux-x86_64.tar.bz2
rm /tmp/phantomjs-${PHANTOMVERSION}-linux-x86_64.tar.bz2

# headless-selenium
cd /opt
git clone https://github.com/generalredneck/headless-selenium
mv headless-selenium/headless-selenium /etc/init.d/
mkdir -p /usr/lib/headless-selenium
cd /usr/lib/headless-selenium
ln -s /opt/app/dash/tests/system/selenium/user-extensions.js .
wget ${SELENIUMURL}
cd /opt
mkdir -p /etc/headless-selenium
mv headless-selenium/selenium.conf /etc/headless-selenium/
sed -i -e "s;^#SELENIUM_JAR=.*$;SELENIUM_JAR=\$HEADLESS_SELENIUM_DIR/selenium-server-standalone-${SELENIUMVERSION}.jar;" \
	-e 's;^#SELENIUM_OPTIONS=.*$;SELENIUM_OPTIONS="-userExtensions $HEADLESS_SELENIUM_DIR/user-extensions.js";' \
	/etc/headless-selenium/selenium.conf 
mkdir -p /usr/lib/headless-selenium/profiles/firefox
cd /usr/lib/headless-selenium/profiles/firefox
tar xvfz /opt/headless-selenium/selenium-profile.tar.gz
#/etc/init.d/headless-selenium start


read -p "Which user should be created to modify the source files and run the build? " username
adduser --disabled-password --gecos "" $username

grep Sencha ~/.bashrc >> /home/${username}/.bashrc
chown -R ${username}:${username} /opt/app/dash
chown -R ${username}:${username} /opt/Sencha

su - ${username}
# run the rest as user ${username}

# Frontend build
cd /opt/app/dash/frontend
ant build

# Backend
cd /opt/app/dash/backend
echo "repoDir = /opt/dash/tests/data/repo" >> application/configs/application.ini

################################
# You should now be able to open
# http://dash-dev/ in your Browser
################################
