<?php
//ini_set("display_errors", "on");
//require_once('util/vendor/composer/autoload_real.php');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');
define("NO_HANDLE_ERRORS", true);

require("./DataService.php");
$notifyParams = json_decode($_REQUEST['notifyParams']);
//error_log("Received request " . json_encode($_REQUEST));
$dataService = DataService::getInstance();
$dataService->startDBProfile();

//TODO THE USER SHOULD BE LOGGED IN TO HIT THIS PAGE... DENIAL OF SERVICE!!!
//TODO several parameters need to be filtered out before being sent to the client
//Namely access_code and permissions.
//Also, these parameters need to not be writable.
//    $application->GetStudentEvaluationAsApplicationArray();

$applicationType = null;
$fromEmail = null;

if(array_key_exists("applicationId", $notifyParams)) {
    error_log("NOTIFY to " . json_encode($notifyParams));

    $applicationData = $dataService->loadAdmissionApplication($notifyParams->applicationId);
    if($applicationData && array_key_exists("notificationType", $notifyParams) && $notifyParams->notificationType == "applicationPayment") {
        $applicationData['AmountPaid'] = $notifyParams->amount;
        $application = $dataService->saveAdmissionApplication($applicationData);
    }
    //Optimization opportunity.  All the data does NOT need to be returned.
    $application = $dataService->reconstituteApplicationData(array($applicationData))[0];
    error_log("Loading application " . json_encode($application, JSON_PRETTY_PRINT));

    $applicationType = $application['ApplicationType'];
    $fromEmail = getCoordinatorEmail($applicationType);
}

if(array_key_exists("evaluationId", $notifyParams)) {
    $studentEvaluation = $dataService->loadEvaluation($notifyParams->evaluationId, array("AccessCode"=>true));
    $accessCode = $studentEvaluation['AccessCode'];
}

$dataService->stopDBProfile();


if(array_key_exists("link", $notifyParams)) {
    $link = $notifyParams->link;
    error_log("LINK FOR EMAIL " . $link);
} else {  //special case for evaulation notifications... needs to be genericized.
    $link = APPLICATION_LINK."?accessCode=$accessCode&evaluationType=".$notifyParams->evaluationType;
}
error_log("Access URL:\n" . $link);

try {
    $substitutions = array("__LINK__"=>$link,
                           "__TITLE__"=>$notifyParams->emailTitle,
                           "__APPLICATION_LINK__" => APPLICATION_LINK,
                           "__DATE__"=>date("F j, Y"));

    if(array_key_exists("message", $notifyParams)) {
       $substitutions["__MESSAGE__"] = $notifyParams->message;
    }
    if(array_key_exists('substitutions', $notifyParams)) {
        //error_log("Merging in substitutions " . json_encode($notifyParams->substitutions));
        $substitutions = array_merge($substitutions, (array)$notifyParams->substitutions);
    } else {
        //error_log("What's in there: " . json_encode($_REQUEST));
    }
    if(isset($application)) {
        //error_log("Sending application notification " . json_encode($application));
        $substitutions["__STUDENT_NAME__"] = getStudentName($application, $dataService);
        error_log("The student name for the evaluation is: '" . $substitutions["__STUDENT_NAME__"] . "'");
        if(isset($studentEvaluation)) {
            $substitutions["__TEACHER_NAME__"] = $studentEvaluation['TeacherName'];
        }
    }
    if(array_key_exists( "emailTo", $notifyParams)) {
        error_log("Sending an email to a role instead of an address " . $notifyParams->message);
        if($notifyParams->emailTo == "admin") {
            $emailAddress = ADMIN_EMAIL;
        } else if ($notifyParams->emailTo == "coordinator") {
            $emailAddress = getCoordinatorEmail($applicationType);
            error_log("Found email for type: " . $emailAddress);
            $fromEmail = COORDINATOR_EMAIL;
        }
    } else {
        $emailAddress =  $notifyParams->notify;
    }

    if(array_key_exists('test', $_REQUEST)) {
        header('Content-type: text/html;charset=UTF-8');
        $substitutions["__STUDENT_NAME__"] = "Sally Applicant";
        //error_log("Subtitution params: " . json_encode($substitutions));
        $htmlMessage = $dataService->getHtmlMessage($notifyParams->templateURL, $substitutions);
        $dataService->sendNotifications("Test email", $_REQUEST['templateURL'] , $_REQUEST['email'], $substitutions, $_REQUEST['email']);
        echo($htmlMessage);
    } else {
        error_log("Sending notification from " . $notifyParams->templateURL);
        $dataService->sendNotifications($notifyParams->subject, $notifyParams->templateURL, $emailAddress, $substitutions, $fromEmail);
    }

    if(isset($studentEvaluation)) {

        if($dataService->hasPermission($dataService->getUser(), "admin", "read")) {//Only admin gets to read the evaluations
            //StudentEvaluation::$loadResponseSet['load'] = true;
        }
    }
} catch(Exception $exception) {
    error_log('Caught exception: ' .  $exception->getMessage() . "\n");
}

function getStudentName($application, $dataService) {
    $studentName = $application['Child']['Person']['FirstName'] . " " . $application['Child']['Person']['LastName'];
    $studentName = trim($studentName);
    return $studentName;
}

function curl_get_file_contents($URL) {
    $c = curl_init();
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_URL, $URL);
    $contents = curl_exec($c);
    curl_close($c);

    if ($contents) {
        return $contents;
    } else {
        return FALSE;
    }
}

function getCoordinatorEmail($applicationType)
{
    error_log("Getting coordinator for " . $applicationType);
    switch ($applicationType) {
        case "EarlyEdAdmissions":
            {
            $emailAddress = COORDINATOR_EMAIL;
            break;
            }
        case "HSMSAdmissions":
            {
            $emailAddress = COORDINATOR_EMAIL;
            break;
            }
        case "InternationalAdmissions":
            {
            $emailAddress = COORDINATOR_EMAIL;
            break;
            }
        default:
            $emailAddress = COORDINATOR_EMAIL;

    }
    return $emailAddress;
}

?>