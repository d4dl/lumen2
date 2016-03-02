<?php


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

define("NO_HANDLE_ERRORS", true);
require("DataService.php");

$dataService = DataService::getInstance();
$request_url = REST_DATA_SERVICE_URL_ROOT . CLIENT_ID . "/people/";
$result = $dataService->get($request_url, $_GET);
echo $result;
?>