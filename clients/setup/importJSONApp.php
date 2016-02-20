<?php
include("head.php");
include("JSONStore.php");
ini_set("log_errors", "on");
ini_set("error_log", "php.log");


$parentMap = array();
$studentImportCount = 0;
ini_set('display_errors', '1');
//error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

if (!$clientId) {
    require("clientIdForm.php");
} else if(isset($_POST["submit"])) {
    ?><pre><?php
    //require_once('../' . $clientId . '/clientConfig.php');
    require_once('DataService.php');
    $dbName = $_REQUEST['clientId'];
    define("MONGO_DB_NAME", $dbName);
    echo("Importing Application into " . $dbName . "\n");
    $dataService = DataService::getInstance();
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $jsonFilename = $_FILES["fileToUpload"]["tmp_name"];
    $jsonData = file_get_contents($jsonFilename);
    $applicationToPersist = json_decode($jsonData, TRUE);
    echo("Import Application Data from $jsonFilename \n $jsonData \n");
    $applicationData = $dataService->extractAndPersistDataObjectsFromApplication($applicationToPersist);

    $application = $dataService->saveAdmissionApplication($applicationData);
    echo("\n\nPersisted app " . json_encode($application, JSON_PRETTY_PRINT));
    echo("\nImported the application");
    ?><pre><?php

    echo("Populated " . $dbName . "\n");
} else {
    ?>
    <!DOCTYPE html>
    <html>
    <body>

        <form action="importJSONApp.php" method="post" enctype="multipart/form-data">
            Select JSON File Containing Application Data:
            <input type="file" name="fileToUpload" id="fileToUpload">    </br>
            <input type="submit" value="Upload" name="submit">
            <input type="hidden" value="<?php echo($clientId); ?>" name="clientId">
        </form>
    </body>
    <?php
}


?>


</body>
</html>