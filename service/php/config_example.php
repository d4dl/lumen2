<?php
#On the dev system this has a symlink to the php directory.  In production systems, the deployment should deploy
#this file to the correct spot.
date_default_timezone_set('America/Chicago');


#define("EXT_OPTIMIZED",true);
########################################################
# D4DL DB and QCubed stuff                             #
########################################################

define("MONGO_DB_NAME", "KSI_Austin");
define("MONGO_DB_USER", "");
define("MONGO_DB_PASSWORD", "");


ini_set('display_errors', 0);
ini_set("log_errors", "on");
#ini_set("error_log", "/usr/www/users/d4dl/consciousgarden.org/lumen/php.log");
ini_set("error_log", "/var/log/php.log");

//define('EXT_OPTIMIZED', true);
define('FILE_UPLOADS', '/Library/WebServer/Documents/lumen/uploads');

define("APPLICATION_LINK", "http://khablestrong.org/admissions");
define("APP_ENTRY_URL", "http://localhost/KSITheme/ksisrcMerge/index.php");
define("STYLE_SHEET", "http://localhost/KSITheme/ksisrcMerge/clientData/ksi/build/match.css");
define("URL_STEM", "http://localhost/KSITheme/ksisrcMerge/");
#define("BASE_URL", "http://remanplanet.com/consciousgarden/lumen/ext/index.php");
#define("STYLE_SHEET", "http://remanplanet.com/consciousgarden/lumen/clientData/ksi/build/match.css");
#define("URL_STEM", "http://remanplanet.com/consciousgarden/lumen/ext/");

define('ADMIN_EMAIL', 'jdeford@gmail.com');
define('INTERNATIONAL_COORDINATOR_EMAIL', 'jdeford@gmail.com');
define('HS_MS_COORDINATOR_EMAIL', 'jdeford@gmail.com');
define('EARLY_ED_CORDINATOR_EMAIL', 'jdeford@gmail.com');
define("EXT_DEBUG", true);

#directory relative to services from which form definitions will be loaded.
define("FORM_DEFINITION_URL_PREFIX", "../clientData/ksi/formDefinitions/applications");
define("CONTENT_PREFIX", "/Users/jdeford/dev/D4DL/Lumen/clientData/ksi/formDefinitions/applications");

define('STRIPE_API_KEY', 'sk_test_YlSaMvj1S0fh8OHg0viDjGnl');
define('STRIPE_PUBLIC_KEY', 'sk_test_YlSaMvj1S0fh8OHg0viDjGnl');
define('STRIPE_APPLICATION_FEE', 7500);//In Cents

date_default_timezone_set('America/Chicago');



########################################################


########################################################
# google data api stuff                                #
########################################################
set_include_path(dirname(__FILE__)."/thirdparty/zengdata/library" . PATH_SEPARATOR . get_include_path());

#Google data services stuff
define("GAPPS_PASSWORD", "Quicks@nd1");
define("GAPPS_USERNAME", "joshua");
define("GAPPS_DOMAIN", "globalhumanprogress.org");
define("GAPPS_SECRET", "XXXX");
define("GAPPS_EMAIL", GAPPS_USERNAME."@".GAPPS_DOMAIN);

//
//define("GAPPS_PASSWORD", "Khabele1@3");
//define("GAPPS_USERNAME", "j.deford");
//define("GAPPS_DOMAIN", "khabele.org");
//define("GAPPS_SECRET", "XXXX");
//define("GAPPS_EMAIL", GAPPS_USERNAME."@".GAPPS_DOMAIN);
########################################################


########################################################
# google oauth2 api stuff                              #
# google oauth2 api stuff                              #
# google delivers this as a json file so we use it     #
########################################################
set_include_path(dirname(__FILE__)."/../thirdparty/google-api-php-client/src" . PATH_SEPARATOR . get_include_path());
define("GAPI_SECRETS_FILE", dirname(__FILE__)."/ghp_client_secrets.json");
//define("GAPI_SECRETS_FILE",dirname(__FILE__). "/k_client_secrets.json");



?>
