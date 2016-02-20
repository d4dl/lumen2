<?php
/**
 * Super bare-bones test
 */
define('CLOSEIO_DEBUG', true);
define('CLOSEIO_API_KEY', "1de6c4db7d16766b2ef5cef3b13dd4e2769e5bb3e6c113f55fa1f912");
require(__DIR__ . '/../lib/Closeio.php');

error_reporting(E_ERROR | E_WARNING | E_PARSE);

$lead_data = new StdClass();
$lead_data->name = "Test User";

$lead = new Closeio\Lead();
$lead_data = new StdClass();
$lead_data->name = "Test D00d3";
$result = $lead->create($lead_data);


$lead = new Closeio\Lead();
//$result = $lead->read(array("query"=>"state:CA"));
$result = $lead->read(array());
echo("Read leads \n<pre>" . json_encode($result, JSON_PRETTY_PRINT) . "</pre>");

$lead_id = $result->id;
$lead = new Closeio\Lead($lead_id);

$update = new StdClass();
$update->name = 'Test Dood Updated';
$result = $lead->update($update);

$result = $lead->delete();

?>


