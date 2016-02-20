<?php
//require_once('util/vendor/composer/autoload_real.php');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');
define("NO_HANDLE_ERRORS", true);

require("./DataService.php");
$dataService = DataService::getInstance();
$dataService->startDBProfile();

error_log("Request: " . json_encode($_REQUEST));
$params;
if(array_key_exists('formData', $_POST)) {
    $params = json_decode($_POST['formData']);
    $applicationId = property_exists($params, 'applicationId') ? $params->applicationId : $_REQUEST['applicationId'];
} else {
    $applicationId = $_REQUEST['applicationId'];
}
$documentDirectory = $dataService->getFileReferenceDirectoryName($applicationId);

$application = $dataService->loadAdmissionApplication($applicationId);

//  error_log("Check perms " . json_encode($dataService->getUser()) . " app id " . $application->Id);
if((!array_key_exists('OwnerId', $application)) || $dataService->hasPermission($dataService->getUser(), $application, "read")) {

    if($_POST['action'] == "delete") {
        $dataService->deleteFileReference($_POST['documentId']);
    } else if($_POST['action'] == "put") {
        $filePath = $documentDirectory."/".$params->fileName . "_uid_" . uniqid();
        $documents = $dataService->loadFileReferencesByNameAdmissionApplicationId($filePath, $applicationId, $objOptionalClauses = null);
        if(count($documents) > 0) {
            $fileReference = $documents[0];
        } else {
            $fileReference = $dataService->saveFileReference(array());
        }
        $fileReference['DocumentType'] = $params->documentType;
        error_log("The document type is " . $params->documentType);
        $fileReference['MimeType'] = $params->mimeType;

        if(!file_exists($documentDirectory)) {
            $retVal = mkdir($documentDirectory);
            if(!$retVal) {
                 error_log("Could not create directory:  " . $documentDirectory);
            }
        }


        //Write the base64 encoded image to a file.
        $retVal = $documentFile = fopen($filePath, "wb");
        if(!$retVal) {
            error_log("There was an error opening file; " . $filePath);
        }

        $retVal = fwrite($documentFile, base64_decode($params->base64Data));
        fclose($documentFile);
        if(!$retVal) {
            error_log("There was an error writing " . $filePath);
        }


        $fileReference['Name'] = $params->fileName;
        $fileReference['Path'] = $filePath;

        $fileReference['AdmissionApplicationId'] = $applicationId;
        $fileReference = $dataService->saveFileReference($fileReference);

        $url = buildUrl($fileReference, $applicationId);
        $output = json_encode(array('Name'=>$fileReference['Name'], 'url'=> $url, 'documentType'=> $fileReference['DocumentType']));
        error_log("File output = " . $output);

    } else if($_REQUEST['action'] == "get") {
        $fileReference = $dataService->loadFileReference($_REQUEST['documentId']);
        header('Content-type: ' . $fileReference['MimeType']);
        header('Content-Disposition: attachment; filename="'.$fileReference['Name'].'"');
        error_log("Outputting file: " . $fileReference['Path']);
        $output = file_get_contents($fileReference['Path']);
    } else if($_POST['action'] == "list") {
        $output = listFiles($applicationId, $dataService);
    }
} else {
    error_log("NO PERMISSION TO ACCESS APPLICATION DOCUMENTS");
}


$dataService->stopDBProfile();
error_log("Action = " . $_POST['action'] . " Document file service outputting " . $output);
echo $output;



/** FUNCTIONS */

function listFiles($applicationId, $dataService)
{
    $documents = $dataService->loadFileReferencesByAdmissionApplicationId($applicationId);

    error_log("Loaded " . count($documents) . " for app id " . $applicationId);
    $dataOut = array();
    foreach ($documents as $fileReference) {
//            if(!property_exists($dataOut, $fileReference->DocumentType)) {
//                $dataOut[$fileReference->DocumentType] = array();
//            }
//            $url = "/khabelebox/php/services/fileService.php?action=get&documentId=".$fileReference->Id."&applicationId=".$applicationId;
//            array_push($dataOut[$fileReference->DocumentType], $url);
        //$documentOut = new stdClass();
        $url = buildUrl($fileReference, $applicationId);
        array_push($dataOut, array('Name'=>$fileReference['Name'], 'url'=> $url, 'documentType'=> $fileReference['DocumentType']));
    }
    $output = json_encode($dataOut);
    header('Content-type: application/json;charset=UTF-8');
    return $output;
}

function buildUrl($fileReference, $applicationId)
{
    return URL_STEM . "/php/services/fileService.php?action=get&documentId=" . $fileReference['_id'] . "&applicationId=" . $applicationId;
}

?>