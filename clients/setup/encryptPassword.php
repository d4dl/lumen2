<?php
include("head.php");
include("JSONStore.php");
require_once('DataService.php');
$dataService = DataService::getInstance();

echo $dataService->encryptPassword($_REQUEST['pwd']);

?>