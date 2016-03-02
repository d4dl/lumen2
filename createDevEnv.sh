#!/bin/bash
touch php.log
chmod 777 php.log
mkdir tokens

#ln -s /Users/joshuadeford/dev/QMinstallations/localdev/clientConfig.php clientConfig.php
#ln -s /Users/joshuadeford/dev/QMinstallations/localdev/.user.ini .user.ini

ln -s /Users/joshuadeford/dev/QMinstallations/localdev localdev
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/templates templates
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/prod.js prod.js
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/formDefinitions formDefinitions
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/ClientApplication.js ClientApplication.js
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/clientImg clientImg
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/clientEmailStyle.css clientEmailStyle.css
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/clientStyle.css clientStyle.css
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/bootstrap.json bootstrap.json
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/bootstrap.js bootstrap.js
ln -s /Users/joshuadeford/dev/QMinstallations/localdev/bootstrap.css bootstrap.css
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/build build

ln -s build/production/MyApp/resources resources
ln -s /Users/joshuadeford/dev/Lumen2/clients/template/build/emailStyle.css emailStyle.css
ln -s /Users/joshuadeford/dev/Lumen2/clients/template/build/style.css style.css
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/index.php index.php
ln -s /Users/joshuadeford/dev/Lumen2/service/php php
ln -s /Users/joshuadeford/dev/Lumen2/service/img img
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/resources.js.php resources.js.php
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/app app
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/ext ext
ln -s /Users/joshuadeford/dev/Lumen2/service/ext/app.js app.js
ln -s /Users/joshuadeford/dev/Lumen2/service/src/js/burst.js burst.js
