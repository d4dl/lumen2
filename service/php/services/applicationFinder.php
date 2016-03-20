<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');
define("NO_HANDLE_ERRORS", true);
require_once("DataService.php");

error_log("Looking for apps for owner: " . json_encode($_REQUEST, JSON_PRETTY_PRINT));
$dataService = DataService::getInstance();
$dataService->startDBProfile();

$output = "{}";
$applications = array();
$totalCount = 0;
if(array_key_exists("sort", $_REQUEST)) {
    $sort = json_decode($_REQUEST['sort']);
}
if(array_key_exists('fields', $_REQUEST)) {
    $fields = json_decode($_REQUEST['fields']);
}


$user = $dataService->getUser();
if(!$user) {
    error_log("There was no user. Exiting");
    exit;
}
// if($dataService->hasPermission($user, "admin", "read")) {//Only admin gets to read the evaluations
//     StudentEvaluation::$loadResponseSet['load'] = true;
// }


//error_log("Finding apps: " . json_encode($_REQUEST));
//TODO make sure all queries are only doing one call to the database.
if(array_key_exists('applicationId', $_REQUEST)) {

    $startTime = microtime(true);
    //error_log("Loading application");

    $userIsAdmin = $dataService->userIsAdmin($dataService->getUser());
    $applicationData = $dataService->loadAdmissionApplication($_REQUEST['applicationId']);
    error_log("Found Application " . json_encode($applicationData));
    //error_log("3. About to reconstitute " . json_encode($applicationData));

    $applications = $dataService->reconstituteApplicationData(array($applicationData), $userIsAdmin);
    $totalCount = count($applications);

    //error_log("Loaded application in " . (microtime(true) - $startTime)  . " seconds");
} else if(array_key_exists('applicationType', $_REQUEST) && $_REQUEST['applicationType']) {
    //Once you get all the child and parent info coming back this will be an optimization opportunity
    $applications = $dataService->findAdmissionApplications(array("ApplicationType"=>$_REQUEST['applicationType'], "Status"=>"Submitted"), $fields);
    $totalCount = count($applications);

} else if(array_key_exists('ownerId', $_REQUEST) && $_REQUEST['ownerId'] !== '') {
    //$criteria = array('$and'=>array("Status"=>array('$ne'=>'Deleted'), array('$or' => array(array("OwnerId" => $_REQUEST['ownerId']), array("AccessIds" => $_REQUEST['ownerId'])))));

    //$criteria = array('$or' => array(array("OwnerId" => $_REQUEST['ownerId']), array("AccessIds" => $_REQUEST['ownerId'])),
    //                  '$and'=>array("Status"=>array('$ne'=>'Deleted')));
    //$criteria = array('$or' => array(array("OwnerId" => $_REQUEST['ownerId']), array("AccessIds" => $_REQUEST['ownerId'])));
    $criteria = array('$and'=> array(array("Status"=>array('$ne'=>'Deleted'), '$or' => array(array("OwnerId" => $_REQUEST['ownerId']), array("AccessIds" => $_REQUEST['ownerId'])))));
    error_log("Performing a query: " . json_encode($criteria, JSON_PRETTY_PRINT));
    $applications = $dataService->findAdmissionApplications(
        $criteria,
        $fields);
    $totalCount = count($applications);

}

$dataService->stopDBProfile();

$dataOut = new stdClass();

$dataOut->applications = $applications;
$dataOut->totalCount = $totalCount;
$dataOut->success = true;
$output = json_encode($dataOut);
if(array_key_exists("callback", $_REQUEST)) {
    $output = $_REQUEST["callback"] . "(".$output.")";
}
echo($output);

function cmp($a, $b)
{
    return strcasecmp($a, $b);
}

?>
