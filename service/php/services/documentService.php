<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

require("./DataService.php");
$dataService = DataService::getInstance();

error_log("Saving document. REQUEST: " . json_encode($_REQUEST, JSON_PRETTY_PRINT));

$documentType = $_REQUEST['documentType'];


if (array_key_exists('action', $_REQUEST)) {
    if ($_REQUEST['action'] == 'adminLoad') {
        $documents = $dataService->findDocuments($documentType, $_REQUEST['queryCriteria'], $_REQUEST['sort']);
        if ($_REQUEST['bootGridResults']) {
            $output = json_encode(array('rows' => $documents));
        } else {
            $output = json_encode($documents);
        }
    }
} else if (array_key_exists('queryCriteria', $_REQUEST)) {

    $queryCriteria = $_REQUEST['queryCriteria'];
    if ($queryCriteria == "0") {
        error_log("Criteria is " . $queryCriteria . " querying without it");
        $documents = $dataService->findDocuments($documentType);
    } else {
        error_log("Criteria is " . $queryCriteria . " querying WITH it");
        $documents = $dataService->findDocuments($documentType, json_decode($queryCriteria));
    }
    $output = json_encode($documents);
} else {
    if (isset($_REQUEST['document'])) {
        $jsonDocument = is_array($_REQUEST['document']) ? $_REQUEST['document'] : json_decode($_REQUEST['document'], true);
    }
    $clearPassword = null;
    if (isset($jsonDocument) && (array_key_exists('Login', $jsonDocument) && array_key_exists("Password", $jsonDocument['Login']) && $jsonDocument['Login']['Password'])) {
        $clearPassword = $jsonDocument['Login']['Password'];
    }
    if (isset($jsonDocument)) {
        error_log("Saving jsonDocument " . json_encode($jsonDocument, JSON_PRETTY_PRINT));
        if ($documentType == "Person") {
            $dataService->savePerson($jsonDocument);
        }
    } else if ($documentType == "DebitSchedule") {
        //Schedules are accessed here and in financeService depending on where the ui sends the request too. Yuck.
        require("./financeProxy.php");
    }

    $document = $jsonDocument;

    if (array_key_exists('createTag', $_REQUEST)) {
        $tag = $dataService->countDocuments($documentType, array()) . "-" . rand(25, 98);
        $document['Tag'] = $tag;
    }
    //error_log("Saving a document " . json_encode($document));
    if ($documentType == "Person") {
        $document = $dataService->savePerson($document);
    } else {
        $document = $dataService->saveDocument($documentType, $document);
    }

    $output = json_encode($document);
}

echo($output);

?>