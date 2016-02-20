<?php
header("Access-Control-Allow-Origin: *");
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

require_once("config.php");
$serverVersion = SERVER_VERSION;
if(array_key_exists("polling", $_REQUEST)) {
    echo $serverVersion;
}

?>
