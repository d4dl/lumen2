<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

//error_log("Auth::: ");

define("NO_HANDLE_ERRORS", true);
require("./DataService.php");
$dataService = DataService::getInstance();

$loadParents = array_key_exists("loadParents", $_REQUEST) && $_REQUEST['loadParents'] == true;
if(array_key_exists("id", $_REQUEST)) {
    $personData = $dataService->loadPerson($_REQUEST['id']);
    $output = json_encode($personData);
} else {
    $loadDebitSchedules = (array_key_exists('loadDebitSchedules', $_REQUEST) && $_REQUEST['loadDebitSchedules'] === "true") ? true : false;
    error_log("!!!!!!!!!!Who said to load debit schedules $loadDebitSchedules " . $_REQUEST['loadDebitSchedules']);
    $users = $dataService->loadStudents(json_decode($_REQUEST['criteria']), $loadDebitSchedules);
    $output = json_encode($users);
}


echo($output);

?>