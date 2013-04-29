Installationsscript
-------------------
apt-get update && apt-get upgrade -y
apt-get install -y vim less git wget zip unzip

# Sourcen
mkdir -p /opt/app
cd /opt/app
git clone https://github.com/pingworks/dash.git dash

# /etc/hosts
IP=$(ip addr list eth0|grep 'inet '|cut -f6 -d' '|cut -f1 -d'/')
cat << EOF >> /etc/hosts
$IP dash dash-test dash-dev
EOF

# Apache
apt-get install -y php5 php5-curl

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

# Sencha Build Tool
apt-get install -y default-jre ant ant-contrib ruby rubygems
cd /tmp/
wget http://cdn.sencha.com/cmd/3.1.0.256/SenchaCmd-3.1.0.256-linux-x64.run.zip
unzip SenchaCmd-3.1.0.256-linux-x64.run.zip
chmod 755 SenchaCmd-3.1.0.256-linux-x64.run
./SenchaCmd-3.1.0.256-linux-x64.run --prefix /opt
rm SenchaCmd-3.1.0.256-linux-x64.run
. ~/.bashrc

# Frontend build
cd /opt/app/dash/frontend
ln -s ../backend/public/.htaccess .
ant build

# Backend
cd /opt/app/dash/backend
echo "repoDir = /opt/dash/tests/data" >> application/configs/application.ini
apt-get install -y zendframework

# Data
cd /tmp/
wget https://dash.pingworks.net/repo/master/1.026167c6.77/artifacts/dash-tests-data.deb
dpkg -i dash-tests-data.deb

################################
# You should now be able to open
# http://dash in your Browser
################################

# Tests
# phantomjs
cd /tmp/
wget https://phantomjs.googlecode.com/files/phantomjs-1.9.0-linux-x86_64.tar.bz2
cd /opt
tar xvfj /tmp/phantomjs-1.9.0-linux-x86_64.tar.bz2
rm /tmp/phantomjs-1.9.0-linux-x86_64.tar.bz2

# headless-selenium
apt-get install xvfb iceweasel
cd /opt
git clone https://github.com/generalredneck/headless-selenium
mv headless-selenium/headless-selenium /etc/init.d/
mkdir -p /usr/lib/headless-selenium
cd /usr/lib/headless-selenium
ln -s /opt/app/dash/tests/system/selenium/user-extensions.js .
wget http://selenium.googlecode.com/files/selenium-server-standalone-2.32.0.jar
cd /opt
mkdir -p /etc/headless-selenium
mv headless-selenium/selenium.conf /etc/headless-selenium/
sed -i -e 's;^#SELENIUM_JAR=.*$;SELENIUM_JAR=$HEADLESS_SELENIUM_DIR/selenium-server-standalone-2.32.0.jar;' \
	-e 's;^#SELENIUM_OPTIONS=.*$;SELENIUM_OPTIONS="-userExtensions $HEADLESS_SELENIUM_DIR/user-extensions.js";' \
	/etc/headless-selenium/selenium.conf 
mkdir -p /usr/lib/headless-selenium/profiles/firefox
cd /usr/lib/headless-selenium/profiles/firefox
tar xvfz /opt/headless-selenium/selenium-profile.tar.gz
/etc/init.d/headless-selenium start

# phpunit
apt-get install -y phpunit

