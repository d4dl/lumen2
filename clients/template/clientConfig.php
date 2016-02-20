<?php
date_default_timezone_set('America/Chicago');

ini_set('display_errors', 0);
ini_set("log_errors", "on");
define('DOMAIN_NAME', "{__DOMAIN_NAME__}");
define('PROTOCOL', "{__PROTOCOL__}");

define("CLIENT_ID", '{__CLIENT_ID__}');//Substituted by the init script
define('MAIN_CONTAINER_WIDTH', 950);//925 is a good value
define("APPLICATION_LINK", "{__ADMISSION_APPLICATION_URL__}");// id http://yourdomain/content/admission-application
define("CLIENT_URL", "{__SCHOOL_URL__}");
define('CLIENT_STRIPE_APPLICATION_FEE', "{__APPLICATION_FEE__}00");
//This is used to crawl up the dom a certain number of nodes so the iframe takes over.
//Finds the target at the specified height and sets it to the width of the node at the breakout height
define('BREAKOUT_HEIGHT', 6);
define('BREAKOUT_TARGET_HEIGHT', 0);

//The annual amount the school charges parents at the time of sale: initial applications and re-enrollments, and/
//or other annual fees, like student supplies and materials, etc
define('QUICKMIT_STRIPE_APPLICATION_FEE', 5000);
define('QUICKMIT_STRIPE_FEE', "3.00%");
define('STRIPE_APPLICATION_FEE', (CLIENT_STRIPE_APPLICATION_FEE + QUICKMIT_STRIPE_APPLICATION_FEE));//In Cents id 7500

define('ADMIN_EMAIL', '{__ADMIN_EMAIL__}');
define('HS_MS_COORDINATOR_EMAIL', '{__COORDINATOR_EMAIL__}');
define('COORDINATOR_EMAIL', '{__COORDINATOR_EMAIL__}');
define('STUDENT_COUNT', '{__STUDENT_COUNT__}');

//This will cause the development code from the templates directory to be used.
define('IS_PRODUCTION', TRUE);


define("SCHOOL_NAME", '{__SCHOOL_NAME__}');
define("SCHOOL_ADDRESS", '{__SCHOOL_ADDRESS__}');
define("SCHOOL_CITY", '{__SCHOOL_CITY__}');
define("SCHOOL_STATE", '{__SCHOOL_STATE__}');
define("CURRENT_APPLICATION_FEE", '{__CURRENT_APPLICATION_FEE__}');
define("ADMIN_NAME", '{__ADMIN_NAME__}');
define("ADMIN_TITLE", '{__ADMIN_TITLE__}');
define("ADMIN_SALUTATION", '{__ADMIN_SALUTATION__}');
define("CURRENT_ADMISSION_APPLICATION_URL", '{__CURRENT_ADMISSION_APPLICATION_URL__}');
define("COORDINATOR_NAME", '{__COORDINATOR_NAME__}');
define("VISITOR_DAY_NAME", '{__VISITOR_DAY_NAME__}');
define("SCHOOL_ZIP", '{__SCHOOL_ZIP__}');


require_once("config.php");

?>

