<?php
include("head.php");
$clientExists = false;
$action = "accountConfiguration.php";
if (!$clientId) {
    //error_log("Client Form Loading");
    require("clientIdForm.php");
} else {
    $clientDir = $lumenDir . "/clients/installation/" . $clientId;
    //error_log("Making client dir: $clientDir");
    $clientExists = file_exists($clientDir);
    //error_log("Does client dir exist $clientExists here $clientDir");
    if($clientExists) {
        error_log("Client DOES exist including file");
        require($clientDir . "/clientConfig.php");
    } else {
        error_log("Client does NOT exist: $clientDir");
    }

    require("setupForm.php");
}

?>

</body>
</html>