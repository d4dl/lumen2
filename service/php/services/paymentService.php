<?php
//ini_set("display_errors", "on");
//require_once('util/vendor/composer/autoload_real.php');

require("DataService.php");
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');
define("NO_HANDLE_ERRORS", true);
error_log("PAYMENT_SERVICE!!!!! " . $_POST['params']);
require_once("../thirdparty/Stripe.php");

$params = json_decode($_POST['params']);
$dataService = DataService::getInstance();

// set your secret key: remember to change this to your live secret key in production
// see your keys here https://manage.stripe.com/account
Stripe::setApiKey(STRIPE_API_KEY);
$paymentService = REST_DATA_SERVICE_URL_ROOT . CLIENT_ID . "/payments";

$feeParameter = $params->fee;
$fee = strpos($feeParameter, '%') > 0 ? (str_replace('%', '', $feeParameter) / 100) : $feeParameter;


if ($params->paymentType == 'applicationFee') {
    try {
        $description = "Admissions Application Fee";
        $application = $dataService->loadAdmissionApplication($params->applicationId);
        $childId = "" . $application["ChildId"]; //Coerce to string

        $applicant = $dataService->loadPerson($childId)['Person'];
        $userName = $dataService->getUserFullName();
        $name = $applicant['FirstName'] . " " . $applicant['LastName'];
        error_log("Loaded child " . json_encode($applicant, JSON_PRETTY_PRINT));
        $bin = substr($params->cc_num, 0, 6);
        $binListURL = "https://binlist.net/json/$bin";
        $verified_debit = verifyCardIsDebit($dataService, $binListURL);
        list($charge, $customerId) = createStripeCharge($dataService, $params->amount, $fee, $params->token, $params->paymentType, $name, $description);

        if ($charge->failure_message) {
            echo(json_encode($charge->failure_message));
        } else {

            $application['AmountPaid'] = $params->amount;
            if (!array_key_exists('Charges', $application)) {
                $application['Charges'] = array();
            }
            $application['Charges'][] = array(
                "ChargeId" => $charge->id,
                "CardId" => $charge->card->id,
                "Amount" => $charge->amount,
                "description" => $charge->description,
                "status" => "paid"
            );
            /**
            array(
            "status"=>"PAID",
            "description"=> $description,
            "processorProcessingFee"=>0.029,
            "usageFee"=>
            "amount"=>
            "creditedToTenant"=>
            "paymentProcessorCustomer"=>
            "paymentProcessorTransactionID"=>
            "executedDate"=>
            "payor"=>
            "student"=>
            )
             */
            //Removes empty keys that stripe sends back.
            $charge = json_decode($charge->__toJSON());
            $charge->ChargeId = $charge->id;
            $charge->Fee = $fee;//The amount kept by quickmit.  The rest is sent to the customer.
            $charge->PersonId = $childId;
            $charge->ChildId = "" . $application["ChildId"]; //Coerce to string
            //error_log("XHA charge " . json_decode($charge));
            $charge = $dataService->saveCharge((array)$charge);
            $dataService->saveAdmissionApplication($application);
            echo(json_encode(array("allCharges" => $application['Charges'], "currentAmount" => ($charge['amount']))));
        }
    } catch (Exception $e) {
        echo(json_encode(array("errorMessage" => $e->getMessage())));
    }
} else {
    $name = "Tuition Charge";
    $description = "Tuition Payment";
    $userName = $dataService->getUserFullName();
    list($charge, $customerId) = createStripeCharge($dataService, $params->amount, $fee, $params->token, $params->paymentType, $name, $description);
    error_log("Charge created: " . json_encode($charge));
    if (array_key_exists("debitScheduleId", $params)) {
        //If this is a payment for an already scheduled debit.  Set the status to active
        $dataService->updateDebitSchedule($params->debitScheduleId, array('$set' => array('isActive' => true, 'paymentProcessorCustomerId' => $customerId)));
    } else if (array_key_exists("debitScheduleTemplateId", $params)) {
        //Otherwise create a new schedule from the template and activate it.
        $debitScheduleTemplate = $dataService->loadDebitScheduleTemplate($params->debitScheduleTemplateId);
        unset($debitScheduleTemplate["_id"]);
        $debitScheduleTemplate["OwnerId"] = $params->OwnerId;
        $debitScheduleTemplate["ChildId"] = $params->ChildId;
        $debitSchedule = $dataService->saveDebitSchedule($debitScheduleTemplate);
    }
    error_log("Saved debit schedule " . json_encode($debitSchedule));
    if (!$charge->failure_message) {
        //The first payment should equal all the fees plus the down payment amount.
        $totalExpectedPayment = $debitSchedule['downPaymentAmount'];

        $debitSchedule["paymentProcessor"] = "Stripe";
        $debitSchedule["paymentProcessorCustomerId"] = $charge->customer;
        $debitScheduleEntry = array();
        $downPaymentDebitScheduleEntry = updateScheduleEntryDetails($charge, $debitScheduleEntry, "downPaymentCharge");
        $debitSchedule["debitScheduleEntries"][] = $downPaymentDebitScheduleEntry;

        foreach ($debitSchedule['fees'] as $fee) {
            $totalExpectedPayment += $fee["amount"];
        }
        $debitSchedule["isActive"] = true;
        //$executedDate = new MongoDate();
        error_log("total expected " . $totalExpectedPayment . " paramsamount " . ($params->amount / 100));
        $actualPayment = $params->amount / 100;
//        if($totalExpectedPayment == $actualPayment) {//Stripe expects amount with no decimal.
//            for($i = 0; $i < count($debitSchedule['fees']); $i++) {
//                $fee = $debitSchedule['fees'][$i];
//                $fee["executedDate"] = $executedDate;
//                $debitSchedule['fees'][$i] = $fee;
//            }
//            $debitSchedule["downPaymentExecutedDate"] = $executedDate;
//            $debitSchedule = $dataService->saveDebitSchedule($debitSchedule);
//
//        } else {
//            error_log("totalExpectedPayment $totalExpectedPayment was different from $actualPayment");
//        }

        $debitSchedule = $dataService->saveDebitSchedule($debitSchedule);
    }
    echo(json_encode(array("allCharges" => array(), "currentAmount" => ($params->amount))));
}


function updateScheduleEntryDetails($charge, &$debitScheduleEntry, $chargeType)
{
    $debitScheduleEntry["paymentProcessorTransactionID"] = $charge->id;
    $debitScheduleEntry["paymentProcessor"] = "Stripe";
    $debitScheduleEntry["paymentProcessorPaymentMethodId"] = "CreditCard";
    $debitScheduleEntry["paymentProcessorCustomerId"] = $charge->customer;
    $debitScheduleEntry["chargeType"] = $chargeType;
    $debitScheduleEntry["status"] = "paid";
    $debitScheduleEntry["debitAmount"] = (int)($charge->amount / 100);
    $executedDate = new MongoDate($charge->created);
    $debitScheduleEntry["executedDate"] = $executedDate;
    return $debitScheduleEntry;
}

function verifyCardIsDebit($dataService, $serviceUrl) {
    $isDebit = false;
    try {
        $output = file_get_contents($serviceUrl);
        $binInfo = json_decode($output);
        if($binInfo && $binInfo->card_category == "DEBIT") {
            $isDebit = true;
        }
    } catch (Exception $e) {
        error_log("Couldn't verify wether the card was debit or credit." . json_encode(array("errorMessage" => $e->getMessage())));
    }
    return $isDebit;
}

// create the charge on Stripe's servers - this will charge the user's card
function createStripeCharge($dataService, $amount, $fee, $token, $paymentType, $name, $description)
{
    $username = $dataService->getUser()['Login']['Username'];
    $customer = Stripe_Customer::create(array(
            "source" => $token,
            "email" => $username,
            "description" => "Parent: " . $username)
    );
    $customerArray = array(
        "stripe_id" => $customer->id,
        "livemode" => $customer->livemode,
        "description" => $customer->description,
        "email" => $customer->email,
        "source" => $customer->source,
    );
    $customerArray["UserId"] = $dataService->getUser()["_id"] . "";//Cast to string
    $dataService->saveStripeCustomer($customerArray);

    $charge = Stripe_Charge::create(array(
            "amount" => $amount, // amount in cents, again
            "currency" => "usd",
            "customer" => $customer->id,
            "metadata" => array(
                "clientId" => CLIENT_ID,
                "paymentType" => $paymentType,
                "userId" => $customerArray["UserId"],
                "quickmitFee" => $fee,
                "application" => $name
            ),
            "description" => $description)
    );
    return array($charge, $customer->id);
}


?>