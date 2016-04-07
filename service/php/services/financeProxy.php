<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');

/**
 * @param $urlEndpoint
 * @param $dataService
 */
function proxy($urlEndpoint, $dataService)
{
    $method = null;
    $data = null;
    $action = null;
    $document = null;

//error_log("Getting finance\n" . json_encode($_REQUEST, JSON_PRETTY_PRINT));
    if (isset($_REQUEST['criteria'])) {
        $data = json_decode($_REQUEST['criteria']);
    }
    if (isset($_REQUEST['document'])) {
        $data = json_decode($_REQUEST['document']);
        error_log("Decoded data: " . json_last_error($data));
    }
    if (isset($_REQUEST['action'])) {
        $urlEndpoint .= "/" . $_REQUEST['action'];
    }
    if (isset($_REQUEST['method'])) {
        $method = $_REQUEST['method'];
    } else {
        $data = $_REQUEST;
    }
    $result = $dataService->httpRequest($urlEndpoint, null, $data, $method);
    $output = json_encode($result);
    error_log("Sending output to client");
    echo(trim($output));
}
