<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

define("NO_HANDLE_ERRORS", true);
require("DataService.php");
$dataService = DataService::getInstance();
$dataService->startDBProfile();
$formData = json_decode($_POST['formData']);

if(array_key_exists('accessCode', $formData)) {
    $accessCode = $formData->accessCode;
    $evaluation = $dataService->loadEvaluationByAccessCode($accessCode);
}

$dataService->stopDBProfile();

if(array_key_exists('load', $formData) && $formData->load) {
    $dataOut = array();
    $childId = $evaluation['ChildId'];
    $dataOut["StudentEvaluationArray"] = array($evaluation);
    error_log("Found Evaluation: " . json_encode($evaluation));
    if($childId) {
        $owner = $dataService->loadPerson($evaluation['OwnerId']);
        $dataOut["ParentEmail"] = $owner['Login']['Username'];

        $child = $dataService->loadPerson($childId);
        $dataOut["Child"] = $child;
        $dataOut["FirstName"] = $child['Person']['FirstName'];
        $dataOut["LastName"] =  $child['Person']['LastName'];
        error_log("Looked up child " . json_encode($child));
    }
    echo(json_encode($dataOut));

} else if($_POST['action'] == "save") {
    //If the execution path is here a teacher has submitted an evaluation for one that already exists.
    $evaluationData = json_decode($_POST['formData'], TRUE);
    //error_log("Saving evaluation data " . json_encode($evaluationData));
    //error_log("BEGIN: Application data for student evaluation." .json_encode($evaluationData) . "\n\n");

    $evaluationData["Complete"] = true;
    $evaluationData["AccessCode"] = null;
    $updatedEvaluation = $dataService->saveEvaluation($evaluationData);
}



?>