<?php
require_once("clientConfig.php");

?>

ExternalResources = {
    stripePublicKey: '<?php echo STRIPE_PUBLIC_KEY; ?>',
    baseURL: '<?php echo APP_ENTRY_URL; ?>',
    urlStem: '<?php echo URL_STEM; ?>'
}

Lumen = {
    I18N_LABELS: {},
    I18N_PROMPTS: {}
};

<?php
  /**
   * Merge the two resource files
   */
    $globalI18nContents = json_decode(file_get_contents(GLOBAL_I18N_FILE), TRUE);
    $globalPromptContents = json_decode(file_get_contents(GLOBAL_PROMPTS_FILE), TRUE);
    $i18nContents = json_decode(file_get_contents(I18N_FILE), TRUE);
    $promptContents = json_decode(file_get_contents(PROMPTS_FILE), TRUE);
    $i18nContents = array_merge($globalI18nContents, $i18nContents);
    $promptContents = array_merge($globalPromptContents, $promptContents);
    echo "\nLumen.I18N_LABELS = " . json_encode($i18nContents);
    echo ";\nLumen.I18N_PROMPTS = " . json_encode($promptContents);
?>

//A lot of these were changed to invalid values just to get the old school name out.
//via a search and replace.
Lumen.IMAGES_URL_ROOT = "<?php echo IMAGES_URL_ROOT; ?>";

Lumen.CLIENT_ID = "<?php echo CLIENT_ID; ?>";
Lumen.SERVER_VERSION = "<?php echo SERVER_VERSION; ?>";
Lumen.MAIN_CONTAINER_WIDTH = "<?php echo MAIN_CONTAINER_WIDTH; ?>";
Lumen.CLIENT_URL = "<?php echo CLIENT_URL; ?>";
Lumen.APPLICATION_LINK = "<?php echo APPLICATION_LINK; ?>";
Lumen.APP_ENTRY_URL = "<?php echo APP_ENTRY_URL; ?>";
Lumen.REST_DATA_SERVICE_URL_ROOT = "<?php echo REST_DATA_SERVICE_URL_ROOT; ?>";
Lumen.DATA_SERVICE_URL_ROOT = "<?php echo URL_STEM; ?>/php/services";
Lumen.FORM_DEFINITION_URL_PREFIX = "<?php echo FORM_DEFINITION_URL_PREFIX; ?>";
Lumen.CONTENT_PREFIX = "<?php echo CONTENT_PREFIX; ?>";
Lumen.BREAKOUT_HEIGHT = "<?php echo BREAKOUT_HEIGHT; ?>";
Lumen.BREAKOUT_TARGET_HEIGHT = "<?php echo defined("BREAKOUT_TARGET_HEIGHT") ? BREAKOUT_TARGET_HEIGHT : ""; ?>";


Lumen.URL_APP_INTRO = "<?php echo URL_APP_INTRO; ?>";
Lumen.STRIPE_APPLICATION_FEE_PRETTY = "$" + (<?php echo STRIPE_APPLICATION_FEE; ?>/100).toFixed(2);

Lumen.CLIENT_STRIPE_APPLICATION_FEE = <?php echo STRIPE_APPLICATION_FEE; ?>;
Lumen.QUICKMIT_STRIPE_APPLICATION_FEE = <?php echo QUICKMIT_STRIPE_APPLICATION_FEE; ?>;
Lumen.QUICKMIT_STRIPE_FEE = '<?php echo QUICKMIT_STRIPE_FEE; ?>';


Lumen.URL_TEACHER_TEMPLATE = "<?php echo URL_TEACHER_TEMPLATE; ?>";
Lumen.URL_PARENT_TEMPLATE = "<?php echo URL_PARENT_TEMPLATE; ?>";
Lumen.URL_ADMIN_TEMPLATE = "<?php echo URL_ADMIN_TEMPLATE; ?>";

Lumen.URL_EVALUATION_EMAIL_TEMPLATE = "<?php echo URL_EVALUATION_EMAIL_TEMPLATE; ?>";
Lumen.URL_ADMISSION_WELCOME = "<?php echo URL_ADMISSION_WELCOME; ?>";
Lumen.URL_ACCOUNT_CREATION = "<?php echo URL_ACCOUNT_CREATION; ?>";
Lumen.URL_ADMISSION_NOTIFICATION = "<?php echo URL_ADMISSION_NOTIFICATION; ?>";
Lumen.URL_FORGOT_PASSWORD = "<?php echo URL_FORGOT_PASSWORD; ?>";
Lumen.URL_APPLICATION_RECEIVED = "<?php echo URL_APPLICATION_RECEIVED; ?>";
Lumen.URL_APPLICATION_FEE_RECEIPT = "<?php echo URL_APPLICATION_FEE_RECEIPT; ?>";
Lumen.URL_GUEST_DAYS_REQUEST_RECEIVED = "<?php echo URL_GUEST_DAYS_REQUEST_RECEIVED; ?>";
Lumen.URL_ADMIN_GUEST_DAYS_NOTIFICATION  = "<?php echo URL_ADMIN_GUEST_DAYS_NOTIFICATION; ?>";
Lumen.URL_ADMIN_EVAL_RECEIVED_NOTIFICATION  = "<?php echo URL_ADMIN_EVAL_RECEIVED_NOTIFICATION; ?>";
Lumen.URL_PARENT_EVAL_RECEIVED_NOTIFICATION  = "<?php echo URL_PARENT_EVAL_RECEIVED_NOTIFICATION; ?>";
Lumen.URL_ACCEPTANCE_EMAIL_NOTIFICATION  = "<?php echo URL_ACCEPTANCE_EMAIL_NOTIFICATION; ?>";
Lumen.URL_ENROLLMENT_CONFIRMATION  = "<?php echo URL_ENROLLMENT_CONFIRMATION; ?>";
Lumen.URL_ENROLLMENT_FINALIZED  = "<?php echo URL_ENROLLMENT_FINALIZED; ?>";
Lumen.URL_REENROLL_BOOTSTRAP_EMAIL  = "<?php echo URL_REENROLL_BOOTSTRAP_EMAIL; ?>";
Lumen.URL_ENROLL_REMINDER_EMAIL  = "<?php echo URL_ENROLL_REMINDER_EMAIL; ?>";

Lumen.URL_ENROLLMENT_PROCESSED_NOTIFICATION  = "<?php echo URL_ENROLLMENT_PROCESSED_NOTIFICATION; ?>";


