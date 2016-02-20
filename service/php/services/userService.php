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
    if(array_key_exists("sort", $_REQUEST)) {
        $sort = json_decode($_REQUEST['sort']);
        for($i = 0; $i < count($sort); $i++) {
            $sort[$i]->property = "Person." . $sort[$i]->property;
        }
    }
    if(array_key_exists('fields', $_REQUEST)) {
        $fields = json_decode($_REQUEST['fields']);
    }

    $criteria = array();
    if(array_key_exists('query', $_REQUEST)) {
        //Expect a query by name to com in an create a criteria object for it.
        $name = $_REQUEST['query'];
        $criteria = array('$and'=>array('$or'=>array(array("Person.FirstName"=>array('$regex'=>new MongoRegex("/.*$name.*/i"))),
                                       array("Person.LastName"=>array('$regex'=>new MongoRegex("/.*$name.*/i"))))));
    }

    if(array_key_exists('criteria', $_REQUEST)) {
        //Add any additional criteria passed in.
        $additionalCriteria = json_decode($_REQUEST["criteria"]);
        if(count($criteria) == 0) {
            $criteria = $additionalCriteria;
        } else {
            $criteria['$and'][] = $additionalCriteria;
        }
    }
    error_log("Criteria is " . json_encode($criteria, JSON_PRETTY_PRINT));

    $users = $dataService->loadUsers($_REQUEST['start'], $_REQUEST['limit'], $sort, $criteria, $loadParents);
    $output = getUserOutput($dataService, $users, $criteria);
}


echo($output);

function getUserOutput($dataService, $users, $criteria=null) {
    $totalCount = $dataService->countDocuments("Person", $criteria);
    $dataOut = new stdClass();

    $dataOut->users = $users;
    $dataOut->totalCount = $totalCount;
    $dataOut->success = true;
    $output = json_encode($dataOut);
    if (array_key_exists("callback", $_REQUEST)) {
        $output = $_REQUEST["callback"] . "(" . $output . ")";
        return $output;
    }
    return $output;
}

?>