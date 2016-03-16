<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

//$endpoint = filter_var($_REQUEST['endpoint'], FILTER_SANITIZE_STRING);
$url = REST_DATA_SERVICE_URL_ROOT . CLIENT_ID . "/schedules";
if(isset($_REQUEST['id'])) {
    $url .= "/" . filter_var($_REQUEST['id'], FILTER_SANITIZE_NUMBER_INT);
}
$method = null;
$data = null;
$action = null;
$document = null;

//error_log("Getting finance\n" . json_encode($_REQUEST, JSON_PRETTY_PRINT));
if(isset($_REQUEST['criteria'])) {
    $data = json_decode($_REQUEST['criteria']);
}
if(isset($_REQUEST['document'])) {
    $data = json_decode($_REQUEST['document']);
}
if(isset($_REQUEST['action'])) {
    $url .= "/" .$_REQUEST['action'];
}
if(isset($_REQUEST['method'])) {
    $method = $_REQUEST['method'];
}
$result = $dataService->httpRequest($url, null, $data, $method);
$output = json_encode($result);
echo($output);

?>