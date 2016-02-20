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
$populationColumn = array_search("sudentPopulation", $columnNames);
$gradeColumn = array_search("grade", $columnNames);
$phoneColumn = array_search("phone", $columnNames);
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
    $grade = $data[$gradeColumn];
    $population = $data[$populationColumn];
    $phone = $data[$phoneColumn];
    echo("\nChecking " . $name . ": " . $url . "\n");
    //echo(". ");

    $query = sprintf("street:\"%s\" city:\"%s\" state:\"%s\" zip:\"%s\" company:\"%s\"", $street, $city, $state, $zip, $name);
    $result = $lead->read(array(query => $query));
    //echo("\nResults \n" . json_encode($result, JSON_PRETTY_PRINT));
    //exit;
    //if(array_key_exists($url, $nameMap) && !array_key_exists($name, $nameMap)) {
    if ($result->total_results == 0) {
        $lead = new Closeio\Lead();

        $lead_data = new StdClass();
        populateLead($lead_data, $uri, $url, $name, $population, $grade, $phone);
        populateAddress($lead_data, $street, $city, $state, $zip);
        populatePhone($lead_data, $phone);

        //echo("Trying to create lead " . json_encode($lead_data, JSON_PRETTY_PRINT));
        $result = $lead->create($lead_data);
        //echo("\nCreated a lead:\n" . json_encode($result, JSON_PRETTY_PRINT));
        echo("\nCreating a lead " . $url . "\n");
    }
    if ($result->total_results == 1) {
        echo("\nUpdating a lead " . $url . "\n");
        $lead = $result->data[0];
        $lead = new Closeio\Lead($lead->id);
        $lead_data = populateLead($lead, $uri, $url, $name, $population, $grade, $phone);
        $result = $lead->update($lead_data);
    } else if ($result->total_results > 1) {
        echo("Found more than one " . json_encode($result, JSON_PRETTY_PRINT) . " results");
    }
    //exit;

}

function populateLead($lead_data, $uri, $url, $name, $population, $grade, $phone)
{
    $lead_data->url = $url;
    $betterName = trim(ucwords($name));
    if ($betterName != $name) {
        $name = $betterName;
    }
    $lead_data->company = $name;
    $lead_data->name = $name;
    $lead_data->display_name = $name;
    $custom = (array)$lead_data->custom;

    if (isset($population)) {
        $custom["Student Population"] = $population;
    }
    if (isset($grade)) {
        $custom["grade"] = $grade;
    }

    $custom["URI"] = $uri;
    $lead_data->custom = (object)$custom;
    return $lead_data;
}

function populatePhone($lead_data, $phone)
{
    if (isset($phone)) {
        $lead_data->contacts = array(array("name" => "", "title" => "", "emails" => array(), "phones" => array(array("phone" => $phone))));
    }
}

function populateAddress($lead_data, $street, $city, $state, $zip)
{
    $address_data = array();
    $address_data["address_1"] = $street;
    $address_data["city"] = $city;
    $address_data["state"] = $state;
    $address_data["zipcode"] = $zip;
    $address_data["country"] = "US";
    $lead_data->addresses[0] = $address_data;
    return $address_data;
}

fclose($handle);
echo("import finished for $count schools.");

echo("<pre></pre>");
?>
