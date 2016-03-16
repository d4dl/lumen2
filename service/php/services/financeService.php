<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

require("./DataService.php");
$dataService = DataService::getInstance();



//Schedules are accessed here and in DocumentService depending on where the ui sends the request too. Yuck.
require("./financeProxy.php");

?>