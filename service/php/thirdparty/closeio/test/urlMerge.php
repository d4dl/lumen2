<?php
/**
 * Super bare-bones test
 */
define('CLOSEIO_DEBUG', true);
define('CLOSEIO_API_KEY', "1de6c4db7d16766b2ef5cef3b13dd4e2769e5bb3e6c113f55fa1f912");
require(__DIR__ . '/../lib/Closeio.php');

error_reporting(E_ERROR | E_WARNING | E_PARSE);
echo("<pre>");

$lead = new Closeio\Lead();

$row = 1;
$handle = fopen("plmExport.csv", "r");
$data = fgetcsv($handle, 0, ",");
$columnNames = $data;
$nameColumn = array_search("name", $columnNames);
$urlColumn = array_search("url", $columnNames);
$uriColumn = array_search("school", $columnNames);
$streetColumn = array_search("street", $columnNames);
$cityColumn = array_search("city", $columnNames);
$stateColumn = array_search("state", $columnNames);
$zipColumn = array_search("zip", $columnNames);
$count = 1;
//echo(json_encode($nameMap, JSON_PRETTY_PRINT));
    echo("Starting import\n");
    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $count++;
        //echo("Data " . json_encode($data, JSON_PRETTY_PRINT));
        $url = strtolower($data[$urlColumn]);
        $street = $data[$streetColumn];
        $city = $data[$cityColumn];
        $state = $data[$stateColumn];
        $zip = $data[$zipColumn];
        $uri = $data[$uriColumn];
        $name = $data[$nameColumn];
        if($state == "CA") {
            echo("\nChecking " . $name . ": " . $url);
            //echo(". ");

            $query = sprintf("street:\"%s\" city:\"%s\" state:\"%s\" zip:\"%s\" company:\"%s\"", $street, $city, $state, $zip, $url);
            $result = $lead->read(array(query=>$query));
            //echo("\nResults \n" . json_encode($result, JSON_PRETTY_PRINT));

            //if(array_key_exists($url, $nameMap) && !array_key_exists($name, $nameMap)) {
            if($result->total_results == 1) {
                //A lead that whose name was its url was found.
                //Fix it.
                echo("<br/>Found a url named lead!! " . $url . "\n");
                $lead = $result->data[0];
                if($lead) {
                    //echo("<br/>going to delete lead: <pre>".json_encode($lead, JSON_PRETTY_PRINT)."</pre>");

                    $lead = new Closeio\Lead($lead->id);
                    $lead->url = $url;
                    $lead->company = $name;
                    $lead->name = $name;
                    echo("Updating name to $name" );
                    $lead->display_name = $name;
                    $lead->custom["URI"] = $uri;
                    $result = $lead->update($lead);
                    //$result = array();
                    //echo("updated lead: <pre>".json_encode($result, JSON_PRETTY_PRINT)."</pre>");
                } else if($result->total_results > 1) {
                    echo("Found more " . $result->total_results . " results");
                }

                //exit;
            }
            //exit;
            $betterName = trim(ucwords($name));
            if($betterName != $name) {
                $lead->name = $betterName;
                echo("\nFixing up name from '$name' to '$betterName''");
                //$result = $lead->update($lead);
            }
        }
    }
    fclose($handle);
    echo("import finished for $count schools.");

echo("<pre></pre>");
?>
