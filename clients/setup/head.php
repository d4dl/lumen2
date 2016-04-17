<?php

error_reporting(E_ALL & ~E_NOTICE);
require_once("localConfig.php");
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css"/>
    </head>
    <body>
        <?php
date_default_timezone_set('America/Chicago');
/**
* TODO   __SCHOOL_URL__ not being replaced
*/
ini_set('display_errors', '1');
ini_set('error_log', __DIR__ . "/../../php.log");

$lumenDir = realpath(__DIR__ . "/../../");
ini_set('include_path', ini_get('include_path') . ":/usr/www/users/d4dl/quickmit/production/service/php:/usr/www/users/d4dl/quickmit/production/service/php/services");

//error_log("Requestis " . json_encode($_REQUEST, JSON_PRETTY_PRINT));

$clientId = array_key_exists('clientId', $_REQUEST) ? $_REQUEST["clientId"] : "";
$clientId = !$clientId ? (array_key_exists('{__CLIENT_ID__}', $_REQUEST) ? $_REQUEST["{__CLIENT_ID__}"] : "") : $clientId;

$clientDirToCreate = $lumenDir . "/clients/installation/" . $clientId;
$clientDir = $clientId ? realpath($clientDirToCreate) : "";
if($clientId) {
    ini_set('include_path', ini_get('include_path') . ":/usr/www/users/d4dl/quickmit/production/clients/installation/$clientId:/usr/www/users/d4dl/quickmit/production/service/php:/usr/www/users/d4dl/quickmit/production/service/php/services");
}
error_log("Client id: '$clientId' client dir '$clientDir' to create '$clientDirToCreate'");
