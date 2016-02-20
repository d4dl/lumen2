<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

define("NO_HANDLE_ERRORS", true);
require("DataService.php");

$dataService = DataService::getInstance();

$dataService->startDBProfile();



$dataService->stopDBProfile();
$contentUrl = $_REQUEST['contentUrl'];
error_log("Loading content " . $contentUrl);
if(strpos($contentUrl, "http") === 0) {
    $output = $dataService->file_get_contents($contentUrl);
} else {
    $output = file_get_contents($contentUrl);
}
if(array_key_exists("json", $_REQUEST) && $_REQUEST['json'] == true) {
    header('Content-type: application/json;charset=UTF-8');
    echo html_entity_decode($output);
} else {
    echo $output;
}
?>