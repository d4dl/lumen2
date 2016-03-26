<?php
date_default_timezone_set('America/Chicago');

ini_set('display_errors', 0);
ini_set("log_errors", "on");
define('DOMAIN_NAME', "quickmit.net");
define('PROTOCOL', "https");

define("CLIENT_ID", 'localhost');//Substituted by the init script
define('MAIN_CONTAINER_WIDTH', 950);//925 is a good value
define("APPLICATION_LINK", "http://khabelestrong.org/admission-application");// id http://yourdomain/content/admission-application
define("CLIENT_URL", "http://khabelestrong.org");
define('CLIENT_STRIPE_APPLICATION_FEE', "5000");
//This is used to crawl up the dom a certain number of nodes so the iframe takes over.
define('BREAKOUT_HEIGHT', 0);


//The annual amount the school charges parents at the time of sale: initial applications and re-enrollments, and/
//or other annual fees, like student supplies and materials, etc
define('QUICKMIT_STRIPE_APPLICATION_FEE', 5000);
define('QUICKMIT_STRIPE_FEE', "3.00%");
define('STRIPE_APPLICATION_FEE', (CLIENT_STRIPE_APPLICATION_FEE + QUICKMIT_STRIPE_APPLICATION_FEE));//In Cents id 7500

define('ADMIN_EMAIL', 'jdeford@gmail.com');
define('HS_MS_COORDINATOR_EMAIL', 'jdeford@gmail.com');
define('COORDINATOR_EMAIL', 'jdeford@gmail.com');
define('STUDENT_COUNT', '38');

//This will cause the development code from the templates directory to be used.
define('IS_PRODUCTION', FALSE);


define("SCHOOL_NAME", 'Khabele + Strong Incubator');
define("SCHOOL_ADDRESS", '1701 Toomey Road');
define("SCHOOL_CITY", 'Austin');
define("SCHOOL_STATE", 'Texas');
define("CURRENT_APPLICATION_FEE", '100');
define("ADMIN_NAME", 'Michael Strong');
define("ADMIN_TITLE", 'Director');
define("ADMIN_SALUTATION", 'Day Visit');
define("CURRENT_ADMISSION_APPLICATION_URL", 'http://khabelestrong.org/admission-application');
define("COORDINATOR_NAME", 'Susan Tingley');
define("VISITOR_DAY_NAME", 'Guest Day');
define("SCHOOL_ZIP", '78704');


require_once("config.php");

?>

