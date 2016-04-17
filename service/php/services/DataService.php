<?php
//TODO make sure logins for parents don't get destroyed when somebody is saving their person data.
date_default_timezone_set('America/Chicago');
include_once('clientConfig.php');
include_once('vendor/autoload.php');
include_once('thirdparty/PHPMailer/PHPMailerAutoload.php');
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

if (array_key_exists("version", $_REQUEST)) {
    error_log("Servicing requests for verion " . $_REQUEST['version']);
} else {
    error_log("No version sent to server");
}

//if(!IS_PRODUCTION) {
//    $sentClientVersion = $_REQUEST['CLIENT_VERSION'];
//    if($_SERVER['REQUEST_METHOD'] == "GET" && $sentClientVersion !== SERVER_VERSION) {
//        $newLocation = APPLICATION_LINK . "?version=" . SERVER_VERSION;
//        error_log("Client and server version don't match. Cache busting to $newLocation");
//        header('Location: ' . $newLocation);
//    }
//}
class DataService
{
    private static $SINGLETON = null;
    private $user = null;   //Sort comes in as: [{"property":"firstname","direction":"DESC"}]
    private $mongoDB = null;
    private $activeApplicationQuery = array('$and' => array(
        array('Status' => array('$ne' => 'Rejected')),
        array('Status' => array('$ne' => 'Deleted')),
        array('ApplicationType' => array('$exists' => true))));

    /** Mongo Document Collections */
    private $AdmissionApplication = null;
    //For session management only
    private $AdmissionApplicationElement = null;
    private $FileReference = null;
    private $JSONForm = null;
    private $JSONFormTemplate = null;
    private $FinancialAidApplication = null;
    private $DebitScheduleTemplate = null;
    private $DebitSchedule = null;
    private $masterPassword = '$6$rounds=5000$lah04ShD982vtDMA$qI/CFBFR1HZ3Azd/BTg3hapDunCciZ./dLHn0aNCN8qiM.ERsHQQDkDZ01//Zn/lRlBtuarUVOzfBHlnQCK.e1';
    private $log;

    private $documentServiceURL = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/documents/";
    private $personServiceURL = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/people/";
    private $chargesServiceURL = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/charges/";
    private $studentServiceURL = REST_DATA_SERVICE_URL_ROOT . TENANT_ID . "/students/";

    static function getInstance() {
        if (DataService::$SINGLETON == null) {
            DataService::$SINGLETON = new DataService();
        }
        return DataService::$SINGLETON;
    }

    private function __construct() {
        require_once("SessionManager.php");
//        $ipAddress = $this->get_ip();
//        if($ipAddress != "70.112.206.72") {
//            error_log("Received a request from $ipAddress", 1, "joshua@quickmit.net");
//        }
//
//        error_log("Received a request from " . $ipAddress);
        // connect

        //error_log("Connecting to mongo with " . MONGO_CONNECTION);
        $this->mongo = new MongoClient(MONGO_CONNECTION);
        $this->mongoDB = $this->getDB(MONGO_DB_NAME);
        $this->landlordMongoDB = $this->getDB(LANDLORD_MONGO_DB_NAME);

        //error_log("\nConnecting to mongo db: '" . MONGO_DB_NAME . "'");
        $this->AdmissionApplication = $this->getCollection("AdmissionApplication", $this->mongoDB);
        $this->AdmissionApplicationElement = $this->getCollection("AdmissionApplicationElement", $this->mongoDB);
        $this->FileReference = $this->getCollection("FileReference", $this->mongoDB);
        $this->JSONForm = $this->getCollection("JSONForm", $this->mongoDB);
        $this->JSONFormTemplate = $this->getCollection("JSONFormTemplate", $this->mongoDB);
        $this->DebitSchedule = $this->getCollection("DebitSchedule", $this->mongoDB);
        $this->DebitScheduleTemplate = $this->getCollection("DebitScheduleTemplate", $this->mongoDB);
        $this->FinancialAidApplication = $this->getCollection("FinancialAidApplication", $this->mongoDB);

        $this->StripeCustomer = $this->getCollection("StripeCustomer", $this->landlordMongoDB);

        $sess = new SessionManager($this->mongoDB->Session);

    }

    public function getCollection($collectionName, $mongoDB) {
        $collection = $collection = $mongoDB->$collectionName;
        if ($collection) {
            //Lazy Create Collections
            $collection = $mongoDB->createCollection($collectionName);
        }
        return $collection;
    }

    public function getDB($useDB) {
        $db = $this->mongo->$useDB;
        if (!$db) {
            //Weird way to create a db but this is how its done
            $this->mongoDB->createCollection($useDB, "Session");
            $db = $this->mongo->$useDB;
        }
        return $db;
    }

    public function getUser() {
        if ($this->user == null) {
            $this->user = $this->findUserLogin();
            //error_log("Login: " . json_encode($this->user) . " The login pid is " . $loginPID);
        }

        return $this->user;
    }

    public function getUserFullName() {
        $user = $this->loadPerson($this->getUser()['systemId']);
        //error_log("Getting full user name from " . json_encode($user));
        $userName = $user['firstName'] . " " . $user['lastName'];
        return $userName;
    }

    /**
     * Generic CRUD methods
     */
    public function saveDocument($documentType, $document, $loadDocument = true) {
        $documentIsNew = false;
        if($documentType == "Person") {
            throw new Exception("You can't use this method to save a person. You have to use savePerson");
        }

        //error_log("Saving a document in " . $documentType . "\n" . json_encode($document, JSON_PRETTY_PRINT));
        $returnDocument = null;
        try {
            if (array_key_exists('id', $document)) {
                unset($document["id"]);
            }
            $id = null;
            if (array_key_exists("_id", $document)) {
                $document["Updated"] = time();
                if ($document['_id'] instanceof MongoId) {
                    $id = $document["_id"];
                } else {
                    $id = new MongoId($document['_id']['$id']);
                }
            } else {
                $documentIsNew = true;
                $id = new MongoId();
                $document["Created"] = time();
            }
            $document["_id"] = $id;

            $status = $this->$documentType->update(array("_id" => $id), $document, array("upsert" => true));
            if ($loadDocument) {
                $returnDocument = $this->$documentType->findOne(array("_id" => $id));
            } else {
                $returnDocument = array("_id" => $id);
            }
        } catch (Exception $e) {
            error_log("ERRROR" . json_encode($document, JSON_PRETTY_PRINT) .
                "Error saving that document with id " .
                json_encode($id) .
                ". which " .
                (($id instanceof MongoId) ? "IS" : "IS NOT") .
                " an instance of MongoId "
            );

            error_log($e->getMessage() . "\n" . $e->getTraceAsString());
        }
        if($documentIsNew) {
            $rights = array(
                "systemId"=>$document["_id"]."",
                "documentType"=>$document["applicationType"],
                "collectionName"=>$documentType,
                "accessType"=>"subject"
            );
            $right = $this->post($this->documentServiceURL . "rights/" . $returnDocument["ChildId"], $rights);
        }
        //error_log("updated document $documentType");// . json_encode($document, JSON_PRETTY_PRINT));
        return $returnDocument;
    }

    public function loadDocument($documentType, $documentId, $projectedFields = null) {
        // error_log("Loading document for id: " . $documentId, $projectedFields);
        if (is_object($documentId)) {
            $documentId = ("" . $documentId);//Coerce to string.  It may be {_id: {'$id': <the_id>}}
        }
        try {
            $id = new MongoId($documentId);
        } catch (Exception $e) {
            throw new Exception("Error creating mongo id with input='" . json_encode($documentId));
        }
        if ($projectedFields) {
            $document = $this->$documentType->findOne(array("_id" => $id), $projectedFields);
        } else {
            $document = $this->$documentType->findOne(array("_id" => $id));
        }
        return $document;
    }

    public function countDocuments($documentType, $criteria) {
        $count = $this->$documentType->count($criteria);
        error_log("Counting $documentType $count");
        return $count;
    }

    public function findDocuments($documentType, $criteria = null, $fields = null) {
        if (!$criteria) {
            $criteria = array();
        }
        error_log("FINDINGDOCUMENT " . $documentType . " Criteria " . json_encode($criteria, JSON_PRETTY_PRINT));
        if ($fields) {
            $applications = iterator_to_array($this->$documentType->find($criteria, $fields), false);
        } else {
            $applications = iterator_to_array($this->$documentType->find($criteria), false);
        }
        return $applications;
    }

    /**
     */
    public function createEndpoint($url, $fields, $data, $method, $useBinary) {
        $endpoint = curl_init();
        $headers = array();
        $headers[] = 'Connection: Keep-Alive';
        $headers[] = 'Accept: application/json';
        if ($method == "GET") {
            $headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';
        } else {
            $headers[] = 'Content-Type: application/json';
        }
        $headers[] = 'SHARED_SECRET: ' . SHARED_SECRET;
        $user_agent = 'Quickmit Proxy: ' . $_SERVER['HTTP_USER_AGENT'];

        curl_setopt($endpoint, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($endpoint, CURLOPT_HEADER, 1);
        curl_setopt($endpoint, CURLOPT_USERAGENT, $user_agent);
        curl_setopt($endpoint, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($endpoint, CURLOPT_FAILONERROR, true);
        curl_setopt($endpoint, CURLOPT_CONNECTTIMEOUT, 120000);
        if ($useBinary) {
            curl_setopt($endpoint, CURLOPT_BINARYTRANSFER, 1);
        }
        curl_setopt($endpoint, CURLOPT_ENCODING, "gzip");
        $sessionRequestDataKeyStr = '';
        error_log("Creating fields " . json_encode($fields, JSON_PRETTY_PRINT));
        if ($fields) {
            ksort($fields, SORT_STRING);
            $fields_string = http_build_query($fields);
            if ($method != "GET") {
                curl_setopt($endpoint, CURLOPT_POST, count($fields));
            }
        } else if($data) {
            if(is_string($data)) {
                //error_log("__DATA $data");
                $fields_string = $data;
            } else {
                //error_log("encoding__DATA $data");
                if($method == "GET") {
                    $fields_string = http_build_query($data);
                } else {
                    $fields_string = json_encode($data);
                }
            }
        }
        if (isset($fields_string)) {
            if ($method == "GET" || $method == "DELETE") {
                $url .= "?$fields_string";
            } else {
                error_log("Setting post fields for $url \n to string\n" . $fields_string);
                curl_setopt($endpoint, CURLOPT_POSTFIELDS, $fields_string);
                $headers[] = 'Content-Length: ' . strlen($fields_string);
            }
        }
        curl_setopt($endpoint, CURLOPT_HTTPHEADER, $headers);
        if($url == "http://localhost:8089/quickmit-rest-1.1/v1.1/localhost/people/" && $method == "GET") {
            throw new Exception("WTF");
        }
        error_log("Warning Sent request to " . $url . " with headers\n". json_encode($headers));

        curl_setopt($endpoint, CURLOPT_URL, $url);
        return $endpoint;
    }

    protected function deleteDocument($documentType, $id) {
        $status = $this->$documentType->remove(
            array("_id", (string)$id)
        );
        return $status;
    }

    public function saveStripeCustomer($stripeCustomer)
    {
        $stripeCustomer = $this->saveDocument("StripeCustomer", $stripeCustomer);
        return $stripeCustomer;
    }

    public function loadStripeCustomer($stripeCustomerId, $projectedFields = null)
    {
        $stripeCustomer = $this->loadDocument("StripeCustomer", $stripeCustomerId, $projectedFields);
        return $stripeCustomer;
    }

    /** ***************************************************************************************************************** */

    public function saveDebitSchedule($debitSchedule)
    {
        $debitSchedule = $this->saveDocument("DebitSchedule", $debitSchedule);
        return $debitSchedule;
    }

    public function loadDebitSchedule($debitScheduleId, $projectedFields = null)
    {
        $DebitSchedule = $this->loadDocument("DebitSchedule", $debitScheduleId, $projectedFields);
        return $DebitSchedule;
    }

    public function updateDebitSchedule($debitScheduleId, $updateData)
    {
        $this->DebitSchedule->findAndModify(array("_id" => new MongoId($debitScheduleId)), $updateData);
    }

    public function saveDebitScheduleTemplate($debitScheduleTemplate)
    {
        $debitScheduleTemplate = $this->saveDocument("DebitScheduleTemplate", $debitScheduleTemplate);
        return $debitScheduleTemplate;
    }

    public function loadDebitScheduleTemplate($debitScheduleTemplateId, $projectedFields = null)
    {
        $DebitScheduleTemplate = $this->loadDocument("DebitScheduleTemplate", $debitScheduleTemplateId, $projectedFields);
        return $DebitScheduleTemplate;
    }

    /**
     * AdmissionApplication Data Access
     **/
    public function saveAdmissionApplication($application)
    {
        unset($application['StudentEvaluationArray']);
        $application = $this->saveDocument("AdmissionApplication", $application);
        $application = $this->reconstituteApplicationData(array($application))[0];
        return $application;
    }

    public function loadAdmissionApplication($applicationId)
    {
        $application = $this->loadDocument("AdmissionApplication", $applicationId);
        return $application;
    }

    public function updateAdmissionApplication($applicationId, $updateData)
    {
        $this->AdmissionApplication->findAndModify(array("_id" => new MongoId($applicationId)), $updateData);
    }

    /**
     * Update the application status without backsliding into an earlier status.
     * @param $applicationId
     * @param $status
     */
    function updateApplicationStatus($applicationId, $status)
    {
        $statusEnum = array(
            "Started",
            "Submitted",
            "Accepted",
            "Bootstrapping",
            "Enrolling",
            "Enrolled",
            "Admitted",
            "Rejected");
        $applicationData = $this->loadAdmissionApplication($applicationId);
        $currentStatus = $applicationData['Status'];
        //error_log("Current status: $currentStatus \nRequested status: $status");

        $setStatus = true;
        if (!$currentStatus) {
            $setStatus = true;
        } else {
            $candidateStatusPosition = array_search($status, $statusEnum);
            $currentStatusPosition = array_search($currentStatus, $statusEnum);
            if ($candidateStatusPosition === FALSE || $currentStatusPosition === FALSE) {
                $message = "Either curentStatus $currentStatus or status $status was not found in " . json_encode($statusEnum, JSON_PRETTY_PRINT);
                error_log("Failed detecting status backsliding $message");
                error_log($message, 1, "jdeford@gmail.com");
            } else {
                $setStatus = $candidateStatusPosition > $currentStatusPosition;
                error_log("Candidate status: $candidateStatusPosition \n Current Status $currentStatusPosition setStatus? $setStatus");
            }
        }
        if ($setStatus) {
            $this->updateAdmissionApplication($applicationId, array('$set' => array('Status' => $status)));
        }
    }

    //fields isn't used yet.  Optimization strategy is to use only what's in fields.
    public function findAdmissionApplications($criteria, $fields)
    {
        if ($fields && array_key_exists('AdmissionApplication', $fields)) {
            $fields = $fields->AdmissionApplication;
        }
        error_log("Searching for applications with fields: " . json_encode($fields));
        $applications = $this->findDocuments("AdmissionApplication", $criteria, $fields);
        //error_log("1. About to reconstitute " . json_encode($applications));
        $applications = $this->reconstituteApplicationData($applications, false);
//        $parentIds = array();
//        $childIds = array();
//        foreach($applications as $application) {
//            $parentIds[] = array_merge($parentIds, $application['ParentIds']);
//            $childIds[] = $application['ChildId'];
//        }
//        $childInfo = $this->loadPerson($application['ChildId'], $fields['Child']);
        return $applications;
    }


    public function sortCursor($documentType, $query, $sort = null, $limit = null, $start = null)
    {
        error_log("Finding for query " . json_encode($query));
        if ($query) {
            $cursor = $this->$documentType->find($query);
        } else {
            $cursor = $this->$documentType->find();
        }

        //error_log("Preparing query sorting on: " . json_encode($sort, JSON_PRETTY_PRINT). json_encode($query, JSON_PRETTY_PRINT));
        if (isset($sort)) {
            $sort = $sort[0]; //Just the first sort;
            $sortClause = null;
            $sortProperty = $sort->property;
            switch ($sortProperty) {
                default: {
                    $direction = $sort->direction == 'ASC' ? 1 : -1;
                    $cursor->sort(array($sort->property => $direction)); //1 means ascending
                    break;
                }
            }
        }
        if (isset($limit)) {
            $cursor->skip($start)->limit($limit);
        }

        $applications = iterator_to_array($cursor, false);
        //error_log("Returning Applications: " . json_encode($applications));
        return $applications;
    }

    /**
     * Removes the evaluation data and parents and children from application data,
     * persists them and associates each document accordingly
     * reconstituteApplicationdData does the inverse operation.
     */
    public function extractAndPersistDataObjectsFromApplication($applicationData)
    {
        $parents = $applicationData['Child']['guardianList'];
        //error_log("Evaluation IDs " . json_encode($evaluationIds, JSON_PRETTY_PRINT));

        $this->saveParents($parents);
        $child = $this->saveStudentAndSwapForId($applicationData);

        if (array_key_exists('StudentEvaluationArray', $applicationData)) {
            $studentEvaluationArray = $applicationData['StudentEvaluationArray'];
            unset($applicationData['StudentEvaluationArray']);
            $evaluationIds = $this->saveStudentEvaluations($studentEvaluationArray, $applicationData['ChildId'], $applicationData['OwnerId']);
            $applicationData['StudentEvaluationIds'] = $evaluationIds;
        } else {
            error_log("No Student Evaluation Array.  This could be problematic. Not sure.");
        }

        if (array_key_exists('Charges', $applicationData)) {
            $charges = $applicationData['Charges'];
            unset($applicationData['Charges']);
            foreach ($charges as $charge) {
                $applicationData['Charges'][] = array("ChargeId" => $charge['ChargeId']);
            }
        }

        //error_log("Persisted app " . json_encode($applicationData, JSON_PRETTY_PRINT));
        return $applicationData;
    }

    public function saveParents($parents) {
        foreach ($parents as $parent) {
            if(!empty($parental)) {
                $this->savePerson($parental);
            }
        }
    }

    public function saveStudentAndSwapForId(&$containingData)
    {
        error_log("Preparing to save student " . json_encode($containingData, JSON_PRETTY_PRINT));
        $studentData = $containingData['Child'];
        unset($containingData['Child']);
        error_log("Looking for Child in containingData");
        $student = null;
        if(!empty($studentData)) {
            error_log(json_encode($studentData) . " is not null");
            $student = $this->savePerson($studentData);
            $containingData['ChildId'] = "" . $student['systemId'];
        }
        return $student;
    }

    /**
     * Loads the application from the data store as well as
     * the assocated child and parent documents.  Reconstiting the whole
     * thing as one document to send back to the client.
     * extractAndPersistDataObjectsFromApplication does the inverse operation
     */
    public function reconstituteApplicationData($applications, $loadFullEvaluations = false) {
        //error_log("3. Reconstituting " . json_encode($applications));
        $returnApps = array();
        $chargeApplicationMap = array();
        $applicationMap = array();
        foreach ($applications as $application) {
            error_log("3. Reconstituting application " . json_encode($application, JSON_PRETTY_PRINT));
            //BIG Optimization opportunity.  This does two queries per application
            if (array_key_exists("Charges", $application)) {
                foreach ($application['Charges'] as $charge) {
                    $chargeApplicationMap[$charge["ChargeId"]] = $application['_id'] . "";
                }
            }
            $childSystemId = $application['ChildId'];
            if (!$childSystemId) {
                trigger_error("There is not childSystemId specified. Either figure out a way to send it in, or figure out the right way to handle not having it.", E_USER_ERROR);
                exit();
                error_log("There is no child associated with this application!!!!");
            }
            $childData = $this->loadPerson($childSystemId);
            //The id needs to stay on
            //unset($childData['_id']);
            //error_log("Where are my has child arrays " . json_encode($childData, JSON_PRETTY_PRINT));

            $guardianList = $childData['guardianList'];
            //error_log("Where are my has child arrays " . json_encode($guardianList, JSON_PRETTY_PRINT));
            if (!$guardianList) {
                error_log("!!!!\n!!!!\nThere is no child array for '$childSystemId''. This is a problem.\n!!!!\n!!!!");
                //continue;
            }

            $application['Child'] = $childData;
            $evaluations = array();
            if (array_key_exists('StudentEvaluationIds', $application)) {
                foreach ($application['StudentEvaluationIds'] as $evaluationId) {
                    //Optimization.  Get all these at once.
                    if ($loadFullEvaluations) {
                        $evaluation = $this->loadEvaluation($evaluationId, $loadFullEvaluations);
                    } else {
                        $evaluation = $this->loadEvaluation($evaluationId, array("TeacherName" => true,
                            "Created" => true,
                            "Updated" => true,
                            "Email" => true,
                            "Panel" => true,
                            "UID" => true,
                            "EvaluationType" => true));
                    }
                    $evaluation['_id'] = "" . $evaluation['_id'];
                    $evaluations[] = $evaluation;
                }
            }
            $application['StudentEvaluationArray'] = $evaluations;

            //error_log("====Loading child for application for id " . $childSystemId . " got " . json_encode($childData));
            $returnApps[] = $application;

        }
        //error_log("Processing charges " . json_encode(array_keys($chargeApplicationMap)));
        error_log("Warning: Charges are not being sent.  They may not be being acccounted for.");
        /**
        $cursor = $this->Charge->find(array(
            'ChargeId' => array('$in' => array_keys($chargeApplicationMap)
            )));
        foreach ($cursor as $charge) {
            //error_log("Processing Charge " . json_encode($charge, JSON_PRETTY_PRINT));
            $chargeId = $charge["ChargeId"];
            $applicationId = $chargeApplicationMap[$chargeId];
            $chargeApplicationMap[$applicationId][] = $charge;
        }

        for ($i = 0; $i < count($returnApps); $i++) {
            $application = $returnApps[$i];
            if (array_key_exists($application["_id"] . "", $chargeApplicationMap)) {
                $application["Charges"] = $chargeApplicationMap[$applicationId];
                $returnApps[$i] = $application;
            }
        }
         * **/

        return $returnApps;
    }

    public function postCharge($charge) {
        $charge = $this->post($this->chargesServiceURL, $charge);
        return $charge;
    }
    public function loadCharge($chargeId) {
        $charge = $this->get($this->chargesServiceURL, $chargeId);
        return $charge;
    }

    public function saveStudentEvaluations($studentEvaluationArray, $childSystemId, $ownerId)
    {
        $studentEvaluationIds = array();
        foreach ($studentEvaluationArray as &$studentEvaluation) {
            if (!array_key_exists('_id', $studentEvaluation)) {
                $accessCode = uniqid();
                $studentEvaluation['AccessCode'] = $accessCode;
                $studentEvaluation['ChildId'] = "" . $childSystemId; //Coerce to string
                $studentEvaluation['OwnerId'] = "" . $ownerId;
                $studentEvaluation = $this->saveEvaluation($studentEvaluation);
                //error_log("Saved student evaluation " . json_encode($studentEvaluation, JSON_PRETTY_PRINT));
            }

            $studentEvaluationIds[] = "" . $studentEvaluation['_id'];//Coerce toString();
        }
        unset($studentEvaluation);
        return $studentEvaluationIds;

    }


    /** ***************************************************************************************************************** */

    /**
     * Person Data Access
     * session id if the user was just authenticated.
     */
    public function savePerson($person, $sessionId=null, $clearSession=false) {
        //error_log("Saving person " . json_encode($person, JSON_PRETTY_PRINT));
        $clearPassword = isset($person['password2']) ? $person['password2'] : null;
        unset($person['password2']);
        unset($person['debitScheduleSummary']);
        if(isset($person['parentalStatus'])) {
            if(is_array($person['parentalStatus']) && count($person['parentalStatus'])) {
                $person['parentalStatus'] = $person['parentalStatus'][0];
            }
        }
        error_log("Thisis hte person getting persissted " . json_encode($person, JSON_PRETTY_PRINT));
        if (array_key_exists('id', $person)) {
            if ($clearPassword) {
                error_log("Password found... encrypting '" . $clearPassword . "'");
                $person['login']['password'] = $this->encryptPassword($clearPassword);
            }
            error_log("Loading person with system id. " . $person['systemId']);
            $storedPerson = $this->loadPerson($person['systemId']);
            $userIsAdmin = $this->userIsAdmin($storedPerson);
            $user = $this->getUser();
            if (isset($person['login']) && !$userIsAdmin && $storedPerson['id'] != $user['id']) {
                //User must be an admin or the person to change login info
                //Putting it back to what it was
                error_log("Replacing persons login with the original\n" . json_encode($storedPerson));
                $person['login'] = $storedPerson['login'];
            }
        }
        if (isset($person['login']) && ($clearSession || $sessionId)) {
            $person['login']['sessionId'] = $clearSession ? null : $sessionId;
        }


        if (isset($person["login"]) && !$userIsAdmin) {
            $person['login']['groups'] = $storedPerson['login']['groups'];
        }
        unset($person['password2']);
        if(array_key_exists("guardianList", $person)) {
            $person = $this->post($this->studentServiceURL, $person);
        } else {
            $person = $this->post($this->personServiceURL, $person);
        }
        return $person;
    }

    public function loadStudents($criteria, $loadDebitSchedules=false) {
        error_log("Loading people with request ");
        $url = $this->studentServiceURL . "findAll?";
        $url .= "limit=".$_REQUEST["limit"] ;
        $url .= "&page=".$_REQUEST["page"];
        $sorters = json_decode($_REQUEST["sort"]);
        $query = isset($_REQUEST["query"]) ? $_REQUEST["query"] : null;
        if($query) {
            $criteria[] = array("name" => "firstName", "value" => $query, "operation"=>"like", "conjunction"=>"or");
            $criteria[] = array("name" => "lastName",  "value" => $query, "operation"=>"like", "conjunction"=>"or");
        }
        foreach($sorters as $sorter) {
            $url .= "&sort=".$sorter->property.",".strtolower($sorter->direction);
        }
        $url .= "&loadDebitSchedules=" . ($loadDebitSchedules ? "true" : "false");
        $persons = $this->post($url, isset($criteria) ? $criteria : array());
        error_log("Loaded PERSONS" . json_encode($persons));
        $personCount = count($persons['content']);
        for($i=0; $i < $personCount; $i++) {
            if(isset($persons['content'][$i]['login'])) {
                unset($persons['content'][$i]['login']['password']);
                unset($persons['content'][$i]['login']['forgotPasswordToken']);
                unset($persons['content'][$i]['login']['temporaryPassword']);
                unset($persons['content'][$i]['login']['username']);
            }
        }
        return $persons;
    }

    public function loadPerson($personId, $projectedFields = null) {
        $Person = $this->get($this->personServiceURL . $personId);
        return $Person;
    }

    public function findByLogin($criteria) {
        $person = $this->post($this->personServiceURL . "findLogin", array($criteria));
        return $person;
    }

    public function findOnePerson($criteria) {
        $person = $this->post($this->personServiceURL . "findOne", array($criteria));
        return $person;
    }
    /** ***************************************************************************************************************** */


    /**
     * Evaluation / Application Request Data Access
     */
    public function saveEvaluation($evaluation)
    {
        //error_log("Saving Evaluation\n " . json_decode($evaluation));
        $evaluation = $this->saveDocument("AdmissionApplicationElement", $evaluation);
        return $evaluation;
    }

    public function loadEvaluationByAccessCode($accessCode)
    {
        //Optimization: Three queries?  Hmph.
        $evaluation = $this->{'AdmissionApplicationElement'}->findOne(array("AccessCode" => $accessCode));
        $application = $this->loadAdmissionApplication($evaluation['AdmissionApplicationId'], array('ChildId'));
        $childInfo = $this->loadPerson($application['ChildId'], array("FirstName", "LastName"));
        //error_log("LOADED PERSON " . json_encode($childInfo));
        $evaluation['FirstName'] = $childInfo['Person']['FirstName'];
        $evaluation['LastName'] = $childInfo['Person']['LastName'];
        return $evaluation;
    }

    public function loadEvaluation($evaluationId, $projectedFields = null)
    {
        if ($projectedFields) {
            $evaluation = $this->loadDocument("AdmissionApplicationElement", $evaluationId);
        } else {
            $evaluation = $this->loadDocument("AdmissionApplicationElement", $evaluationId, $projectedFields);

        }
        //error_log("Loaded evaluation " . json_encode($evaluation) . " for id " . $evaluationId);
        return $evaluation;
    }
    /** ***************************************************************************************************************** */


    /**
     * Document (pdf and such) Data Access
     */
    public function saveFinancialAidApplication($financialAidApplication)
    {
        $financialAidApplication = $this->saveDocument("FinancialAidApplication", $financialAidApplication);
        return $financialAidApplication;
    }

    public function gloadFinancialAidApplication($financialAidApplicationId)
    {
        $financialAidApplication = $this->loadDocument("FinancialAidApplication", $financialAidApplicationId);
        return $financialAidApplication;
    }

    public function loadAllFinancialAidApplications()
    {
        $financialAidApplications = $this->findDocuments("FinancialAidApplication", array());
        return $financialAidApplications;

    }

    public function saveFileReference($fileReference)
    {
        $fileReference = $this->saveDocument("FileReference", $fileReference);
        return $fileReference;
    }

    public function loadFileReference($fileReferenceId)
    {
        $fileReference = $this->loadDocument("FileReference", $fileReferenceId);
        return $fileReference;
    }

    public function deleteFileReference($fileReferenceId)
    {
        return $this->FileReference->deleteDocument("FileReference", $fileReferenceId);
    }

    public function loadFileReferencesByNameAdmissionApplicationId($name, $applicationId)
    {
        $fileReferences = $this->findDocuments("FileReference", array("Name" => $name, "AdmissionApplicationId" => $applicationId));
        return $fileReferences;
    }

    public function loadFileReferencesByAdmissionApplicationId($applicationId)
    {
        $fileReferences = $this->findDocuments("FileReference", array("AdmissionApplicationId" => $applicationId));
        return $fileReferences;

    }
    /** ***************************************************************************************************************** */

    /**
     * User Data Access
     */
    function prepareUserForStorage($userName, $clearPassword, $session_id, $systemId)
    {
        $crypt = $this->encryptPassword($clearPassword);
        $user = array("email" => strtolower($userName),
                      "login" => array(
                      "password" => $crypt,
                      "username" => strtolower($userName)));
        if ($session_id) {
            $user["login"]["sessionId"] = $session_id;
        }
        return $user;
    }

    public function encryptPassword($clearPassword)
    {
        $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
        error_log("Crypting password " . $clearPassword);
        $crypt = crypt($clearPassword, '$6$rounds=5000$' . $salt . '$');
        return $crypt;
    }

    public function loadUserByUsernameAndPassword($strUsername, $strPassword)
    {
        $user = $this->findByLogin(array("name" => "username", "value" => strtolower((string)$strUsername)));
        error_log("Loading by username and password " . $strUsername . ". User:\n" . json_encode($user));
        $storedCipher = $user['login']['password'];
        //Allow user to authenticate using their password or the master password.
        if (password_verify($strPassword, $storedCipher) || password_verify($strPassword, $this->masterPassword)) {
            error_log("user authenticated! Returning user\n" . json_encode($user, JSON_PRETTY_PRINT));
            return $user;
        } else {
            return null;
        }
    }

    public function loadUserByUsername($strUsername)
    {
        if(!$strUsername) {
            throw new Error("Username cannot be null");
        }
        $user = $this->findByLogin(array("name" => "username", "value" => strtolower((string)$strUsername)));
        return $user;
    }

    public function loadUserByForgotPasswordToken($token)
    {
        $user = $this->findByLogin(array("name" => "forgotPasswordToken", "value" => $token));
        return $user;
    }

    public function findUserLogin() {
        $sessionId = session_id();
        $userLogin = $this->findByLogin(array("name" => "sessionId", "value" => $sessionId));
        //error_log("Looking for user with session " . $sessionId . " and found " . json_encode($userLogin, JSON_PRETTY_PRINT));
        return $userLogin;
        //error_log("Finding user. ");
    }

    /** ***************************************************************************************************************** */


    public function massageForClientConsumption($dataService, $user)
    {
        error_log("Massaging User " . json_encode($user, JSON_PRETTY_PRINT));
        $groups = array_key_exists('groups', $user['login']) ? $user['login']['groups'] : array();
        unset($user['login']['password']);
        unset($user['login']['temporaryPassword']);
        unset($user['login']['forgotPasswordToken']);
        $user['login']['groups'] = $groups;
        return $user;
    }

    function file_get_contents($url, $useragent = 'cURL', $headers = false, $follow_redirects = false, $debug = false)
    {
        $ch = curl_init();
        if(defined("DEV_MODE")) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        if ($headers == true) {
            curl_setopt($ch, CURLOPT_HEADER, 1);
        }
        if ($headers == 'headers only') {
            curl_setopt($ch, CURLOPT_NOBODY, 1);
        }
        if ($follow_redirects == true) {
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        }
        if ($debug == true) {
            $result['contents'] = curl_exec($ch);
            $result['info'] = curl_getinfo($ch);
        } else {
            $result = curl_exec($ch);
        }
        curl_close($ch);
        $result = mb_convert_encoding($result, 'HTML-ENTITIES', "UTF-8");
        return $result;
    }

    function startDBProfile()
    {

    }

    function stopDBProfile()
    {

    }

    static function setHTTPStatus($status = 200, $message = "")
    {
        error_log("Setting http status $message");
        header("HTTP/1.0 $status $message");
    }


    function getFileReferenceFilename($uploadDirectory, $document)
    {
        return $uploadDirectory . "/" . $document->Id;
    }

    function getFileReferenceDirectoryName($applicationId)
    {
        return FILE_UPLOADS . "/applicationDocs/app_" . $applicationId;
    }


    public function sendNotifications($subject, $templateURL, $emails, $substitutions, $fromEmail = null)
    {
        $message = $this->getHtmlMessage($templateURL, $substitutions);

        if ($fromEmail == null) {
            $fromEmail = ADMIN_EMAIL;
        }
        error_log("Sending email to: " . $emails . " From: " . $fromEmail);
        $notificationEmails = explode(",", $emails);
        if (defined("ADMIN_CC")) {
            if (is_array(ADMIN_CC)) {
                $notificationEmails = array_merge($notificationEmails, ADMIN_CC);
            }
            array_push($notificationEmails, ADMIN_CC);
        }
        $report = "";
        if ($notificationEmails) {
            foreach ($notificationEmails as $notificationEmail) {

                $mail = new PHPMailer();
                $mail->CharSet = "UTF-8";
                $mail->setFrom($fromEmail);
                $mail->addReplyTo($fromEmail);
                $mail->addAddress($notificationEmail);
                $mail->Subject = $subject;
                $mail->msgHTML($message);
                $mail->send();

                $report .= "\n" . "Sent message \nTo:'" . $notificationEmail . "'\nSubject:  " . $subject;
            }
        }

        error_log("Send Notification Report: " . $report);
    }

    /**
     * Gets an html message using the baseHtml.php file as
     * the base and substitutes the __variable__ in it.
     * It also inlines the css with the emailStyle.css
     */
    public function getHtmlMessage($templateURL, $substitutions)
    {
        //error_log("Getting html from  " . $templateURL);
        $content = $this->file_get_contents($templateURL);
        //error_log("Contents " . $content);
        $baseTemplate = CLIENT_DATA_DIR . "/templates/baseHtml.php";
        $templateContents = file_get_contents($baseTemplate);
        $message = str_replace("__content__", $content, $templateContents);

        foreach ($substitutions as $substitution => $value) {
            $message = str_replace($substitution, $value, $message);
            //error_log("Substituting " . $substitution . " for " . $value);
        }
        //error_log("base: $baseTemplate \n contents: $templateContents \n message: $message");
        $cssToInlineStyles = new CssToInlineStyles();
        $css = file_get_contents(CLIENT_DATA_DIR . "/emailStyle.css");
        $cssToInlineStyles->setHTML($message);
        $cssToInlineStyles->setCSS($css);

        $convertedMessage = $cssToInlineStyles->convert();
        //error_log("converted message html:\n" . $convertedMessage);
        return $convertedMessage;
    }

    public function hasPermission($person, $resource, $permission)
    {
        if (!$person) {
            return false;
        }
        if ($this->userIsAdmin($person)) {
            return true;
        }
        if (array_key_exists('OwnerId', $resource)) {
            //The string concatenation forces any object's toString method to be called.
            if ($resource['OwnerId'] == "" . $person['_id']) {
                return true;
            }
        }
        return false;
    }

    public function userIsAdmin($person)
    {
        if(isset($person['login'])) {
            $allGroups = $person['login']['groups'];

            error_log("Checking is user is admin on " . json_encode($person, JSON_PRETTY_PRINT));
            //$this->getAllGroups($allGroups, $person['Groups']);

            foreach ($allGroups as $group) {
                if ($group["groupName"] == "admin") {
                    return true;
                }
            }
        }
        return false;
    }

    public function get($url, $fields=null) {
        return $this->httpRequest($url, $fields, null, "GET");
    }
    public function patch($url, $data) {
        return $this->httpRequest($url, null, $data, "PATCH");
    }
    public function put($url, $data) {
        return $this->httpRequest($url, null, $data, "PUT");
    }
    public function post($url, $data) {
        return $this->httpRequest($url, null, $data, "POST");
    }
    public function delete($url, $fields) {
        return $this->httpRequest($url, $fields, null, "DELETE");
    }

    /**
     * wrapper for the specified action which will be /appended to the url.
     * the actor id will also be set as the user_id in the parameters unless $useAuthorizedUser
     * is true.
     * this and buildProcessUrl are very different but should not be.
     */
    public function httpRequest($url, $fields = null, $data = null, $method = null, $useAuthorizedUser = false, $useBinary = false) {
        $method = $method != null ? $method : filter_input(INPUT_SERVER, 'REQUEST_METHOD');
        if(!$fields && !$data && $method != "GET") {
            $body = file_get_contents('php://input');
            if($body) {
                $data = $body;
            }
        }
        error_log("Making http request to $url with method = $method");
        //error_log("Making request: " . $action . " to " . $url);
        $endpoint = $this->createEndpoint($url, $fields, $data, $method, $useBinary);

        $startTime = time();

        //error_log("Requesting process information from " . $url);
        $results = curl_exec($endpoint);
        if ($results === false) {
            throw new Exception("There was a problem connecting to " . $url . "\nError: " . curl_error($endpoint));
        }
        $body = $this->add_headers_from_curl_response($results, $endpoint);

        //error_log("Response: " . json_encode($results));
        $httpCode = curl_getinfo($endpoint, CURLINFO_HTTP_CODE);
        curl_close($endpoint);
        $duration = (time() - $startTime);
        //error_log("HTTP REQUEST TO: " . $url . " duration was " . $duration . " seconds. Retrieved: $body");
        return $body === FALSE ? null : json_decode($body, true);
    }

    /**
     * adds the headers from the response to the headers of the current request response.
     * @param $headerContent
     * @return just the body of the response
     */
    protected function add_headers_from_curl_response($headerContent, $endpoint) {
        $headers = array();

        // Split the string on every "double" new line.
        $arrRequests = explode("\r\n\r\n", $headerContent);

        // Loop of response headers. The "count() -1" is to
        //avoid an empty row for the extra line break before the body of the response.
        for ($index = 0; $index < count($arrRequests) -1; $index++) {
            foreach (explode("\r\n", $arrRequests[$index]) as $i => $line) {
                if ($i === 0) {
                    $headers[$index]['http_code'] = $line;
                } else {
                    if(strpos($line, 'Transfer-Encoding') === FALSE) {
                        header($line);
                        list ($key, $value) = explode(': ', $line);
                        $headers[$index][$key] = $value;
                    }
                }
            }
        }

        $header_size = curl_getinfo($endpoint, CURLINFO_HEADER_SIZE);
        $body = substr($headerContent, $header_size);
        return $body;
    }


    function logOut($message)
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method != "OPTIONS") {
            if (!$this->log) {
                $this->log = array();
                error_log("Starting log");
            }
            array_push($this->log, $message);
        }
    }

    function purgeLog()
    {
        foreach ($this->log as $entry) {
            error_log($entry);
        }
    }

//
//    function better_crypt($input, $rounds = 7) {
//        $salt = "";
//        $salt_chars = array_merge(range('A','Z'), range('a','z'), range(0,9));
//        for($i=0; $i < 22; $i++) {
//            $salt .= $salt_chars[array_rand($salt_chars)];
//        }
//        return crypt($input, sprintf('$2y$%02d$', $rounds) . $salt);
//    }
}


?>