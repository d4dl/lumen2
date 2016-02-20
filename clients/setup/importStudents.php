<?php
include("head.php");
include("JSONStore.php");
ini_set("log_errors", "on");
ini_set("error_log", "php.log");


$parentMap = array();
$studentImportCount = 0;
ini_set('display_errors', '1');
require_once('DataService.php');
//error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

if (!$clientId) {
    require("clientIdForm.php");
} else if(isset($_POST["submit"])) {
    ?><pre><?php
    //require_once('../' . $clientId . '/clientConfig.php');
    echo("Populating " . MONGO_DB_NAME . "\n");
    $dataService = DataService::getInstance();
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $file = file_get_contents($_FILES["fileToUpload"]["tmp_name"]);
    $lines = explode("\r", $file);
    $importCount = 0;
    //DON'T FORGET TO TRIM
    //If you're a parent and you don't have an email, you don't get an account.
    $headers = [];
    echo("Processing lines " . count($lines) . " lines\n");
    foreach($lines as $line) {
        echo("Processing row $line\n");
        $headerCount = count($headers);
        if($headerCount == 0) {
            $headers = explode(",", $line);
        } else {
            $currentTemplateMap = array();
            $elements = explode(",", $line);
            $isStudentRow = $elements[0] != null;
            if($isStudentRow) {
                if(isset($currentStudentTemplate)) {
                    saveStudentDocuments($currentStudentTemplate, $currentApplicationTemplate, $currentParentTemplates);

                }
                $currentStudentTemplate = null;
                $currentParentTemplates = [];
                $currentApplicationTemplate = null;
            }
            $studentTemplate = new JsonStore(getStudentTemplate());
            $parentTemplate = new JsonStore(getParentTemplate());
            $applicationTemplate = new JsonStore(getApplicationTemplate());
            $newTemplateMap = array("Student"=>$studentTemplate, "Parent"=>$parentTemplate, "Application"=>$applicationTemplate);
            $elementCount = count($elements);
            $parentid = 0;

            for($i = 0; $i < $elementCount; $i++) {
                $value = trim($elements[$i]);
                echo("Processing header: $header value: '$value' \n");
                $header = $headers[$i];
                if($value) {
                    $headerKeys = explode(":", $header);
                    foreach($headerKeys as $headerKey) {
                        list($templateKey, $elementKey) = explode("-", $headerKey);
                        //Only process application and student data for students. Not parents.
                        if($isStudentRow || $templateKey == "Parent") {
                            $parentid++;
                            $template = $currentTemplateMap[$templateKey];
                            echo("Using template: $templateKey\n");
                            if(!isset($template)) {//Initialize the template
                                echo("Initializing " . $templateKey . "\n");
                                $template = $newTemplateMap[$templateKey];
                                if(!isset($template)) {
                                    echo("Missing template for " . $templateKey . " in " . json_encode($newTemplateMap) . "\n");
                                }
                                $currentTemplateMap[$templateKey] = $template;
                                if($isStudentRow && $templateKey == "Student") {
                                    $currentStudentTemplate = $template;
                                }
                                if($isStudentRow && $templateKey == "Application") {
                                    $currentApplicationTemplate = $template;
                                }
                                if($templateKey == "Parent") {
                                    $currentParentTemplates[] = $template;
                                }
                            }
                            $before = $template->toString();
                            if(strpos($elementKey, ".") > 0) {
                                $template->set($elementKey, $value);
                            } else {
                                $template->data[$elementKey] = $value;
                            }
                            $after = $template->toString();
                            if($before == $after) {
                                echo("Nothing happened trying to set $templateKey: '$elementKey' : '$value'\nbefore: " . $before . "\nafter :" . $after . "\n");
                            }
                        }
                    }
                }
            }
        }
    }
    saveStudentDocuments($currentStudentTemplate, $currentApplicationTemplate, $currentParentTemplates);
    echo("\nImported $studentImportCount students.");
    ?><pre><?php

    echo("Populated " . MONGO_DB_NAME . "\n");
} else {
    ?>
    <!DOCTYPE html>
    <html>
    <body>

        <form action="importStudents.php" method="post" enctype="multipart/form-data">
            Select csv to import into <?php echo MONGO_DB_NAME; ?>:
            <input type="file" name="fileToUpload" id="fileToUpload">    </br>
            <input type="submit" value="Upload" name="submit">
            <input type="hidden" value="<?php echo($clientId); ?>" name="clientId">
        </form>
    </body>
    <?php
}


function saveStudentDocuments($currentStudentTemplate, $currentApplicationTemplate, $currentParentTemplates) {
    global $parentMap;
    global $studentImportCount;
    global $dataService;
    $studentImportCount++;
    $student= removeMissingValueFromStores("Student", array($currentStudentTemplate))[0];
    $application = removeMissingValueFromStores("Application", array($currentApplicationTemplate))[0];
    $parents = removeMissingValueFromStores("Parents", $currentParentTemplates);
    $hasChildArray = [];
    $parentIds = [];
    $ownerId = null;
    setupLogin($student);
    for($i=0; $i < count($parents); $i++) {
        $parent = $parents[$i];
        $parentId = $parent["_id"];
        $parentEmail = $parent['Person']['Email'];
        setupLogin($parent);

        if(!array_key_exists($parentEmail, $parentMap)) {
            $parent = $dataService->saveDocument("Person", $parent);
            $parentMap[$parentEmail] = $parent;
            echo("\nSaving parent " . json_encode($parent));
        } else {
            $parent = $parentMap[$parentEmail];
           // echo("Parent $parentId already saved. Reusing.");
        }
        echo("\nparentMap:\n" . json_encode($parentMap, JSON_PRETTY_PRINT));
        $parentId = $parent["_id"] . "";
        if(!$ownerId && $parentEmail) {
            $application["OwnerId"] = $parentId;
        }
        $hasChildArray[] = array("ParentId"=>$parentId . "");
        $parentIds[] = $parentId;
        $parents[$i] = $parent;
    }

    $accessIds = $parentIds;
    $student["HasChildArray"] = $hasChildArray;
    $savedChild = $dataService->saveDocument("Person", $student);
    $accessIds[] = $savedChild["_id"] . "";
    $application["AccessIds"] = $accessIds;
    $application["ChildId"] = $savedChild["_id"] . "";
    $savedApplication = $dataService->saveDocument("AdmissionApplication", $application);

    echo("\n\n*****\Processing ".count($parents)." parents: " . json_encode($parents, JSON_PRETTY_PRINT . "\n"));
    echo("\nSaving application: " . json_encode($application, JSON_PRETTY_PRINT . "\n"));
    echo("\nDone Saving student: " . json_encode($student, JSON_PRETTY_PRINT . "\n"));
    echo("\n\n\n");
}

function setupLogin(&$person) {
    global $dataService;
    $personEmail = $person['Person']['Email'];
    if (!$personEmail) {
        //echo("\n" . $person['Person']['FirstName'] . " " . $person['Person']['LastName'] . " has no email");
        unset($person['Login']);
    } else {
        $temporaryPassword = generatePassword();
        $person['Login']['TemporaryPassword'] = $temporaryPassword;
        echo("\nCreated a temporary password from: $temporaryPassword");
        $person['Login']['Password'] = $dataService->encryptPassword($temporaryPassword);
    }
}

function removeMissingValues($document) {
    $returnDocuments = array();
    $documentArray = (array)$document;
    foreach($documentArray as $key=>$value) {
        //echo("\nKey $key value " . json_encode($value, JSON_PRETTY_PRINT));

        if(is_array($value)) {
            $newValue = removeMissingValues($value);
            if(!empty($newValue)) {
                $returnDocuments[$key] = $newValue;
            }
        } else if($value != "XXX") {
            if(!empty($value)){
                //echo("Setting value $value");
                $returnDocuments[$key] = trim($value);
            }
        }
    }
    return $returnDocuments;
}

function removeMissingValueFromStores($documentType, $stores) {
    $documents = array();

    foreach($stores as $store) {
        echo("Removing XXX from $documentType" . ($store != null ? " no problem " : " MISSING STORE!!!! ") . "\n");
        $document = $store->toArray();
        $documents[] = removeMissingValues($document);
    }
    return $documents;
}

function generatePassword() {
    $passwordLength = 7;
    $min = ord ('a');
    $max = ord('z');
    $password = "";
    for($i = 0; $i < $passwordLength; $i++) {
        $password .= chr(rand($min, $max));
    }
    return $password;
}

function getStudentTemplate() {
    $template = <<<EOD
{
    "Grade": "XXX",
    "Person" : {
        "FirstName" : "XXX",
        "LastName" : "XXX",
        "MiddleName" : "XXX",
        "Nickname" : "XXX",
        "Email" : "XXX"
    },
    "Login": {
        "Username" : "XXX"
    },
    "School": {
        "Grade": "XXX",
        "Role": "XXX"
    }
}
EOD;
    return $template;
}
function getParentTemplate() {
    $template = <<<EOD
{
    "Login" : {
        "TemporaryPassword": "XXX",
        "Password" : "XXX",
        "Username" : "XXX",
        "Groups" : [
            "XXX"
        ]
    },
    "School":{"Role": "XXX"},
    "Person" : {
        "FirstName" : "XXX",
        "LastName" : "XXX",
        "Email" : "",
        "PhoneArray" : [
            "XXX",
            "XXX",
            "XXX",
            "XXX"
        ],
        "AddressArray" : [
            {
                "Street" : "XXX",
                "City" : "XXX",
                "Province" : "XXX",
                "PostalCode" : "XXX",
                "Country" : "XXX"
            }
        ]
    }
}

EOD;
    return $template;
}

function getApplicationTemplate() {
    $template = <<<EOD
{
    "Grade" : "XXX",
    "ApplicationType" : "EarlyEdAdmissions",
    "Status" : "XXX",
    "ChildId" : "XXX"
}
EOD;
    return $template;
}

?>


</body>
</html>