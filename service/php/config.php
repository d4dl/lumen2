<?php
date_default_timezone_set('America/Chicago');

ini_set('display_errors', 0);
ini_set("log_errors", "on");
ini_set("expose_php", "Off");

//This is the cache busting mechanism.
//Update and deploy burst.js first with the newest version.
//Then, change this to match.
//All users will then have 3 minutes to reload their browser or it will be done for them.
define("SERVER_VERSION",25);
//Overridables
//The domain name for the iframe hosting the app
defined('DOMAIN_NAME') || define('DOMAIN_NAME', 'dev.quickmit.net');

defined("MONGO_CONNECTION") || define("MONGO_CONNECTION", "mongodb://quickmit:XdAJfcQjCUGRPU2EZgCnwQc0fmG4lBToRDJFHN@127.0.0.1:27017");

//End Overridables


set_include_path(dirname(__FILE__)."/thirdparty/zengdata/library" . PATH_SEPARATOR . get_include_path());

define("LANDLORD_MONGO_DB_NAME", "QUICKMIT_LANDLORD");
defined('MONGO_DB_NAME') || define("MONGO_DB_NAME", CLIENT_ID);
define("MONGO_DB_USER", "");
define("MONGO_DB_PASSWORD", "");
define("SYS_ADMIN_EMAIL", "sysadmin@quickmit.net");
#define("SYS_ADMIN_EMAIL", "jdeford@gmail.com");



#############################################################################
# Directory Configs
#############################################################################
defined("BASE_DIR") || define("BASE_DIR", "/usr/www/users/d4dl/quickmit/production");
define("GLOBAL_CLIENT_DATA_DIR", BASE_DIR . "/clients");
defined("CLIENT_DATA_DIR") || define("CLIENT_DATA_DIR", GLOBAL_CLIENT_DATA_DIR . "/installation/" . CLIENT_ID);
define('FILE_UPLOADS', CLIENT_DATA_DIR . '/uploads');
define("CONTENT_PREFIX", CLIENT_DATA_DIR . "/formDefinitions/applications");
//ini_set("error_log", BASE_DIR . "/php.log");

//error_log("Loading the clients config file for " . CLIENT_ID . "...");


#############################################################################
# URL and URL Prefix configs
#############################################################################
defined("IMAGES_URL_ROOT") || define("IMAGES_URL_ROOT", "../../../service/img");
#define("APPLICATION_LINK", PROTOCOL . "://khablestrong.org/admissions");
define("REST_DATA_SERVICE_URL_ROOT", PROTOCOL . "://quickmit.net:8080/quickmit-rest-1.0/v1");
define("SHARED_SECRET", "qEIqDjBWx9GxpDUTyE1aVuPLMpk3jPKz4NSDCkDmVjcyBe7MqI3ykIoT6o0jcq6gIEPjacZ2wlCRLBs7mTKlAAORlmCPbXDScLGb");
define("FINANCE_URL", REST_DATA_SERVICE_URL_ROOT. "/finance");
defined("URL_STEM") || define("URL_STEM", PROTOCOL . "://" . DOMAIN_NAME . "/clients/installation/" . CLIENT_ID);
define("APP_ENTRY_URL", URL_STEM . "/index.php");
define("STYLE_SHEET", URL_STEM . "/style.css");
define("FORM_DEFINITION_URL_PREFIX", URL_STEM . "/formDefinitions/applications");



$CLIENT_BASE_URL = URL_STEM;
$TEMPLATE_BASE = URL_STEM . "/templates";
define("GLOBAL_I18N_FILE", GLOBAL_CLIENT_DATA_DIR . "/global-admission-instructions.json");
define("GLOBAL_PROMPTS_FILE", GLOBAL_CLIENT_DATA_DIR .  "/global-prompts.json");

define("I18N_FILE", CLIENT_DATA_DIR . "/formDefinitions/admission-instructions.json");
define("PROMPTS_FILE", CLIENT_DATA_DIR . "/formDefinitions/prompts.json");
//define("URL_I18N", $CLIENT_BASE_URL . "/formDefinitions/admission-instructions.json");
//define("URL_PROMPTS", $CLIENT_BASE_URL . "/formDefinitions/prompts.json");
define("URL_APP_INTRO",$TEMPLATE_BASE . "/intro.html");

define("URL_TEACHER_TEMPLATE", $TEMPLATE_BASE . "/eval_email_template.php");
define("URL_PARENT_TEMPLATE",$TEMPLATE_BASE . "/admission_notification_template.php");
define("URL_ADMIN_TEMPLATE",$TEMPLATE_BASE . "/admission_notification_template.php");

define("URL_EVALUATION_EMAIL_TEMPLATE",$TEMPLATE_BASE . "/eval_email_template.php");
define("URL_ADMISSION_WELCOME",$TEMPLATE_BASE . "/admission_welcome_template.php");
define("URL_ACCOUNT_CREATION",$TEMPLATE_BASE . "/account_creation_template.php");
define("URL_ADMISSION_NOTIFICATION",$TEMPLATE_BASE . "/admission_notification_template.php");
define("URL_FORGOT_PASSWORD",$TEMPLATE_BASE . "/reset_password_template.php");
define("URL_APPLICATION_RECEIVED",$TEMPLATE_BASE . "/application_received_template.php");
define("URL_APPLICATION_FEE_RECEIPT",$TEMPLATE_BASE . "/fee_receipt_template.php");
define("URL_GUEST_DAYS_REQUEST_RECEIVED",$TEMPLATE_BASE . "/guest_days_template.php");
define("URL_ADMIN_GUEST_DAYS_NOTIFICATION",$TEMPLATE_BASE . "/admin_guest_days_template.php");
define("URL_ADMIN_EVAL_RECEIVED_NOTIFICATION",$TEMPLATE_BASE . "/admin_evaluation_received_template.php");
define("URL_PARENT_EVAL_RECEIVED_NOTIFICATION",$TEMPLATE_BASE . "/parent_evaluation_received_template.php");
define("URL_REENROLL_BOOTSTRAP_EMAIL",$TEMPLATE_BASE . "/reenroll_bootstrap_template.php");
define("URL_ACCEPTANCE_EMAIL_NOTIFICATION",$TEMPLATE_BASE . "/acceptance_email_template.php");
define("URL_ENROLLMENT_CONFIRMATION",$TEMPLATE_BASE . "/enrollment_confirmation_template.php");
define("URL_ENROLLMENT_FINALIZED",$TEMPLATE_BASE . "/enrollment_finalized_template.php");
define("URL_ENROLLMENT_PROCESSED_NOTIFICATION",$TEMPLATE_BASE . "/enrollment_processed_template.php");
define("URL_ENROLL_REMINDER_EMAIL",$TEMPLATE_BASE . "/enroll_reminder_template.php");




#D4DL Stripe
#define('STRIPE_API_KEY', 'sk_live_sbL3NekINMmtze2bqNzcdQnj');
#define('STRIPE_PUBLIC_KEY', 'pk_live_KT5WRSQNjdAZHJvMMJiOFQwn');
#define('STRIPE_API_KEY', 'sk_test_D3GSyd0usIpszpv3zwmazGhV');
#define('STRIPE_PUBLIC_KEY', 'pk_test_cjUTx2T2gASoLopRGWe41JJ0');


#Quickmit Stripe
if(IS_PRODUCTION) {
    error_log("Using production, live stripe key");
    define('STRIPE_API_KEY', 'sk_live_7NZYSziiA2rBuTaotBNx5aRq');
    define('STRIPE_PUBLIC_KEY', 'pk_live_LIojbxhMRn1rYyzystks5Zb4');
} else {
    error_log("Using test, test stripe key");
    define('STRIPE_API_KEY', 'sk_test_Vd03Bs9TDPlkMtI4wx2t62B8');
    define('STRIPE_PUBLIC_KEY', 'pk_test_SEFZkvQZaKzEPec5vAxoOFkA');
}



########################################################
# google data api stuff                                #
########################################################

#Google data services stuff
define("GAPPS_PASSWORD", "Quicks@nd1");
define("GAPPS_USERNAME", "joshua");
define("GAPPS_DOMAIN", "globalhumanprogress.org");
define("GAPPS_SECRET", "XXXX");
define("GAPPS_EMAIL", GAPPS_USERNAME."@".GAPPS_DOMAIN);

########################################################


########################################################
# google oauth2 api stuff                              #
# google oauth2 api stuff                              #
# google delivers this as a json file so we use it     #
########################################################
set_include_path(dirname(__FILE__)."/../thirdparty/google-api-php-client/src" . PATH_SEPARATOR . get_include_path());
define("GAPI_SECRETS_FILE", dirname(__FILE__)."/ghp_client_secrets.json");

define("WF_URL", "http://localhost:8080/quickmit-rest-1.0");
define("WF_ADMIN_USERNAME", "quickmit");
define("WF_ADMIN_PASSWORD", "11e5b60b1697f925ec7b5f423eb2817e");
#repository/process-definitions/{processDefinitionId}
define("WF_GET_PROCESS_DEFINITION_PATH", "repository/process-definitions/");
define("WF_POST_START_PROCESS_INSTANCE_PATH", "runtime/process-instances");
#{
#   "processDefinitionId":"oneTaskProcess:1:158",
#   "businessKey":"myBusinessKey",
#   "tenantId": "tenant1",
#   "variables": [
#      {
#        "name":"myVar",
#        "value":"This is a variable",
#      }
#   ]
#}
#runtime/tasks?candidateGroups=applicationOwner&processInstanceId=instanceId&tenantId=tenantId
define("WF_GET_PROCESS_TASKS", "runtime/tasks");

define("WF_BASE_USERNAME", "user");
define("WF_BASE_PASSWORD", "quickmit");

#WORKFLOWS
define("WF_PERSONALIZED_ADMISSIONS_ID", "PersonalizedAdmissions:1:7526");

?>