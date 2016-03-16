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
    error_log("Should I load the parents sir? " . $loadParents);
    if($loadParents) {
//        $userCount = count($users);
//        for($i = 0; $i < $userCount; $i++) {
//            $personData = $users[$i];
            //error_log("The user before hydration: " . json_encode($personData, JSON_PRETTY_PRINT));
            $hasChildArray = array_key_exists("HasChildArray", $personData) ? $personData["HasChildArray"] : array();
            //error_log("The user's parents: " . json_encode($hasChildArray, JSON_PRETTY_PRINT));
            $personData["HasChildArray"] = $dataService->reconstituteParents($hasChildArray);
            //error_log("The user with its new parents ". json_encode($personData, JSON_PRETTY_PRINT));
//            $users[$i] = $personData;
//        }
    }
//    error_log("Loading users with query " . json_encode($criteria, JSON_PRETTY_PRINT) . "\nouput\n" . json_encode($users, JSON_PRETTY_PRINT));
    $output = getUserOutput($dataService, array($personData));
} else {
    $loadDebitSchedules = (array_key_exists('loadDebitSchedules', $_REQUEST) && $_REQUEST['loadDebitSchedules'] === "true") ? true : false;
    error_log("!!!!!!!!!!Who said to load debit schedules $loadDebitSchedules " . $_REQUEST['loadDebitSchedules']);
    $users = $dataService->loadStudents(json_decode($_REQUEST['criteria']), $loadDebitSchedules);
    $output = json_encode($users);
}


echo($output);

?>