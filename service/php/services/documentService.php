<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

require("./DataService.php");
$dataService = DataService::getInstance();

error_log("Saving document. REQUEST: "  . json_encode($_REQUEST, JSON_PRETTY_PRINT));

$documentType = $_REQUEST['documentType'];


if(array_key_exists('action', $_REQUEST)) {
    if($_REQUEST['action'] == 'adminLoad') {
        $documents = $dataService->findDocuments($documentType, $_REQUEST['queryCriteria'], $_REQUEST['sort']);
        if($_REQUEST['bootGridResults']) {
            $output = json_encode(array('rows'=>$documents));
        } else {
            $output = json_encode($documents);
        }
    }
} else if(array_key_exists('queryCriteria', $_REQUEST)) {

    $queryCriteria = $_REQUEST['queryCriteria'];
    if($queryCriteria == "0") {
        error_log("Criteria is " . $queryCriteria . " querying without it");
        $documents = $dataService->findDocuments($documentType);
    } else {
        error_log("Criteria is " . $queryCriteria . " querying WITH it");
        $documents = $dataService->findDocuments($documentType, json_decode($queryCriteria));
    }
    $output = json_encode($documents);
} else {
    $jsonDocument = is_array($_REQUEST['document']) ? $_REQUEST['document'] : json_decode($_REQUEST['document'], true);
    $clearPassword = null;
    if(array_key_exists('Login', $jsonDocument) && array_key_exists("Password", $jsonDocument['Login']) && $jsonDocument['Login']['Password']) {
         $clearPassword = $jsonDocument['Login']['Password'];
    }
    error_log("Saving jsonDocument " . json_encode($jsonDocument, JSON_PRETTY_PRINT));
    if($documentType == "Person") {
        $storedUser = null;
        if(array_key_exists('HasChildArray', $jsonDocument)) {
            $parents = $jsonDocument['HasChildArray'];
            $jsonDocument['HasChildArray'] = $dataService->saveAndSwapParentsAndMakePersistable($parents);
        }
        if(array_key_exists('_id', $jsonDocument) && array_key_exists('Login', $storedUser)) {
            $storedUser = $dataService->loadDocument($documentType, $jsonDocument['_id']['$id']);
            ////error_log("Stored User " . json_encode($storedUser));
            //$userIsAdmin = $dataService->userIsAdmin($dataService->getUser());
            //if(!$userIsAdmin) {
            // //Don't let anybody but admins change groups.
            //Just don't let anybody change groups for now
            $jsonDocument['Login'] = $storedUser['Login'];
        }

        unset($jsonDocument['Password2']);
        if($clearPassword) {
            //error_log("Password found... encrypting '" . $clearPassword . "'");
            $jsonDocument['Login']['Password']  = $dataService->encryptPassword($clearPassword);
        }

        $jsonDocument['Person']['Email']    = $jsonDocument['Person']['Email'];
        //error_log("Merged Person into document " . json_encode($jsonDocument, JSON_PRETTY_PRINT));
    } else if ($documentType == "DebitSchedule") {
        if(array_key_exists("debitScheduleEntries", $jsonDocument)) {
            $debitScheduleEntries = $jsonDocument["debitScheduleEntries"];
            for($i=0; $i < count($debitScheduleEntries); $i++) {
                $debitScheduleEntry = $debitScheduleEntries[$i];
                if(array_key_exists("dateToExecute", $debitScheduleEntry)) {
                    $dateToExecute = array_key_exists('sec', $debitScheduleEntry["dateToExecute"]) ? $debitScheduleEntry["dateToExecute"]['sec'] : $debitScheduleEntry["dateToExecute"];
                    $jsonDocument["debitScheduleEntries"][$i]["dateToExecute"] = new MongoDate($dateToExecute);
                }
            }
        }
    }

    $document = $jsonDocument;

    if(array_key_exists('createTag', $_REQUEST)) {
        $tag = $dataService->countDocuments($documentType, array()) . "-" . rand(25, 98);
        $document['Tag'] = $tag;
    }
    //error_log("Saving a document " . json_encode($document));
    $document = $dataService->saveDocument($documentType, $document);

    $output = json_encode($document);
}

echo($output);

?>