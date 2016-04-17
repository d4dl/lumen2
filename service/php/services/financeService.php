<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

require("./DataService.php");
$dataService = DataService::getInstance();



//Schedules are accessed here and in DocumentService depending on where the ui sends the request too. Yuck.
$urlEndpoint = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/schedules";
if(isset($_REQUEST['id']) && ($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'GET')) {
    $urlEndpoint .= "/" . filter_var($_REQUEST['id'], FILTER_SANITIZE_NUMBER_INT);
}
require("./financeProxy.php");
proxy($urlEndpoint, $dataService);

?>