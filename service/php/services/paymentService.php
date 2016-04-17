<?php
//ini_set("display_errors", "on");
//require_once('util/vendor/composer/autoload_real.php');

require("DataService.php");
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');
define("NO_HANDLE_ERRORS", true);
require_once("../thirdparty/Stripe.php");

$dataService = DataService::getInstance();

// set your secret key: remember to change this to your live secret key in production
// see your keys here https://manage.stripe.com/account
Stripe::setApiKey(STRIPE_API_KEY);
$paymentService = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/payments";
//error_log("|---PAYMENT_SERVICE!!!!! " . json_encode($_REQUEST, JSON_PRETTY_PRINT));
if ($_REQUEST['paymentType'] == 'applicationFee') {
    try {
        $description = "Admissions Application Fee";
        $application = $dataService->loadAdmissionApplication($charge->applicationId);
        $childId = "" . $application["child"]["systemId"];

        $applicant = $dataService->loadPerson($childId);
        $userName = $dataService->getUserFullName();
        $name = $applicant['firstName'] . " " . $applicant['lastName'];
        error_log("Loaded child " . json_encode($applicant, JSON_PRETTY_PRINT));
        $charge = $dataService->postCharge($charge);
        if ($charge->failure_message) {
            echo(json_encode($charge->failure_message));
        } else {
            $application['AmountPaid'] = $charge->amount;
            echo(json_encode(array("allCharges" => $application['Charges'], "currentAmount" => ($charge['amount']))));
        }
    } catch (Exception $e) {
        echo(json_encode(array("errorMessage" => $e->getMessage())));
    }
} else {
    $urlEndpoint = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/schedules/update";
    if(isset($_REQUEST['id'])) {
        $urlEndpoint .= "/" . filter_var($_REQUEST['id'], FILTER_SANITIZE_NUMBER_INT);
    }
    $result = $dataService->httpRequest($urlEndpoint);
    echo(json_encode($result));
}


?>