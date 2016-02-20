<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('content-type: application/json; charset=utf-8');

$seconds = $_REQUEST['duration'];
sleep($seconds);
 echo json_encode(array("waited" => $seconds));
?>