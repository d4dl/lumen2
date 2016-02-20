<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

define("NO_HANDLE_ERRORS", true);
require("DataService.php");

$startTime = microtime(true);
error_log("Updating application " . json_encode($_REQUEST, JSON_PRETTY_PRINT));
$dataService = DataService::getInstance();

try {
    if(array_key_exists('action', $_REQUEST) && $_REQUEST['action'] == 'updateStatus') {
        $dataService->updateApplicationStatus($_REQUEST['applicationId'], $_REQUEST['status']);
    } else {
        $userIsAdmin = $dataService->userIsAdmin($dataService->getUser());
        $appDataObjects = json_decode($_POST['formData'], TRUE);
        error_log("App Data Objects " . json_encode($appDataObjects, JSON_PRETTY_PRINT));
        $applicationData = $dataService->extractAndPersistDataObjectsFromApplication($appDataObjects);
        error_log("Persisted app " . json_encode($applicationData, JSON_PRETTY_PRINT));
        $isNewApp = "true";
        if(array_key_exists('_id', $applicationData)) {
            $isNewApp = "false";
        } else {
            $applicationData['Status'] = "Started";
        }

        if(array_key_exists("applicationSubmitted", $_POST) && $_POST["applicationSubmitted"] && $_POST['applicationSubmitted'] != 'false') {
            //error_log("!!!!Setting status to submitted. " . json_encode($_POST));
            $applicationData['Status'] = 'Submitted';
            $applicationData['DateSubmitted'] = date("U");
        }

        if(isset($_FILES) && count($_FILES) > 0) {
            saveFile($dataService, $_REQUEST['DocumentType'], $applicationData);
        }

        $application = $dataService->saveAdmissionApplication($applicationData);     //
        $application = $dataService->reconstituteApplicationData(array($application), $userIsAdmin)[0];
        //error_log("Reconstitutin app data from " . json_encode($application, JSON_PRETTY_PRINT));

        error_log("Updated application in " . (microtime(true) - $startTime)  . " seconds");
    }

} catch (Exception $e) {
    error_log("Error saving. " . json_encode($e->getMessage()) . "\n" . $e->getTraceAsString());
    error_log("The Problematic application Data: \n\n " . json_encode($applicationData) . "\n\n");
}

$appJson = '{"isNewApp": '.$isNewApp.', "applicationData":' . json_encode($application) . "}";
//error_log("Output:\n" . $appJson);

echo($appJson);


function saveFile($dataService, $documentType, $application) {
    $fileReference = array();
    $file = $_FILES['userfile'];

    $uploadDirectory = $dataService->getFileReferenceDirectoryName($application->Id);
    $filePath = $dataService->getFileReferenceFilename($uploadDirectory, $fileReference);
    $fileReference["Path"] = $file['type'];
    $fileReference["Name"] = $file['name'];
    $fileReference["MimeType"] = $file['type'];
    $fileReference["DocumentType"] = $documentType;

    if(!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory,"0755",true);
    }
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        echo "File is valid, and was successfully uploaded.\n";
    } else {
        echo "Possible file upload attack!\n";
    }

    $dataService->saveFileReference($fileReference);
}

?>
