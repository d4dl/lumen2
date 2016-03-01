<?php
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
    private $Person = null;
    private $AdmissionApplicationElement = null;
    private $PermissionGroup = array();
    private $UserGroup = array();
    private $FileReference = null;
    private $Charge = null;
    private $JSONForm = null;
    private $JSONFormTemplate = null;
    private $FinancialAidApplication = null;
    private $DebitScheduleTemplate = null;
    private $DebitSchedule = null;
    private $masterPassword = '$6$rounds=5000$lah04ShD982vtDMA$qI/CFBFR1HZ3Azd/BTg3hapDunCciZ./dLHn0aNCN8qiM.ERsHQQDkDZ01//Zn/lRlBtuarUVOzfBHlnQCK.e1';
    private $log;

    //All the permissions in the system
    private $permissionGroupMap = null;

    //The groups for the current user.
    private $userGroupMap = null;

    static function getInstance()
    {
        if (DataService::$SINGLETON == null) {
            DataService::$SINGLETON = new DataService();
        }
        return DataService::$SINGLETON;
    }

    private function __construct()
    {
        require_once("SessionManager.php");
//        $ipAddress = $this->get_ip();
//        if($ipAddress != "70.112.206.72") {
//            error_log("Received a request from $ipAddress", 1, "joshua@quickmit.net");
//        }
//
//        error_log("Received a request from " . $ipAddress);
        // connect

        $this->mongo = new MongoClient("mongodb://quickmit:XdAJfcQjCUGRPU2EZgCnwQc0fmG4lBToRDJFHN@127.0.0.1:27017");
        $this->mongoDB = $this->getDB(MONGO_DB_NAME);
        $this->landlordMongoDB = $this->getDB(LANDLORD_MONGO_DB_NAME);

        //error_log("\nConnecting to mongo db: '" . MONGO_DB_NAME . "'");
        $this->AdmissionApplication = $this->getCollection("AdmissionApplication", $this->mongoDB);
        $this->Person = $this->getCollection("Person", $this->mongoDB);
        $this->AdmissionApplicationElement = $this->getCollection("AdmissionApplicationElement", $this->mongoDB);
        $this->PermissionGroup = $this->getCollection("PermissionGroup", $this->mongoDB);
        $this->UserGroup = $this->getCollection("UserGroup", $this->mongoDB);
        $this->FileReference = $this->getCollection("FileReference", $this->mongoDB);
        $this->Charge = $this->getCollection("Charge", $this->mongoDB);
        $this->JSONForm = $this->getCollection("JSONForm", $this->mongoDB);
        $this->JSONFormTemplate = $this->getCollection("JSONFormTemplate", $this->mongoDB);
        $this->DebitSchedule = $this->getCollection("DebitSchedule", $this->mongoDB);
        $this->DebitScheduleTemplate = $this->getCollection("DebitScheduleTemplate", $this->mongoDB);
        $this->FinancialAidApplication = $this->getCollection("FinancialAidApplication", $this->mongoDB);

        $this->StripeCustomer = $this->getCollection("StripeCustomer", $this->landlordMongoDB);

        $sess = new SessionManager($this->mongoDB->Session);

    }

    public function getCollection($collectionName, $mongoDB)
    {
        $collection = $collection = $mongoDB->$collectionName;
        if ($collection) {
            //Lazy Create Collections
            $collection = $mongoDB->createCollection($collectionName);
        }
        return $collection;
    }

    public function getDB($useDB)
    {
        $db = $this->mongo->$useDB;
        if (!$db) {
            //Weird way to create a db but this is how its done
            $this->mongoDB->createCollection($useDB, "Session");
            $db = $this->mongo->$useDB;
        }
        return $db;
    }

    public function getUser()
    {
        if ($this->user == null) {
            $this->user = $this->findUserLogin();
            $loginPID = "" . $this->user["_id"];
            //error_log("Login: " . json_encode($this->user) . " The login pid is " . $loginPID);
            $this->permissionGroupMap = iterator_to_array($this->PermissionGroup->find(), false);
        }

        return $this->user;
    }

    function getUserFullName()
    {
        $user = $this->loadPerson($this->getUser()['_id'])['Person'];
        error_log("Getting full user name from " . json_encode($user));
        $userName = $user['FirstName'] . " " . $user['LastName'];
        return $userName;
    }

    /**
     * Generic CRUD methods
     */
    public function saveDocument($documentType, $document, $loadDocument = true)
    {
        error_log("Saving a document in " . $documentType . "\n" . json_encode($document, JSON_PRETTY_PRINT));
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
        //error_log("updated document $documentType");// . json_encode($document, JSON_PRETTY_PRINT));
        return $returnDocument;
    }

    public function loadDocument($documentType, $documentId, $projectedFields = null)
    {
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

    public function findOneDocument($documentType, $criteria)
    {
        $document = $this->$documentType->findOne($criteria);
        return $document;
    }

    public function countDocuments($documentType, $criteria)
    {
        $count = $this->$documentType->count($criteria);
        error_log("Counting $documentType $count");
        return $count;
    }

    public function findDocuments($documentType, $criteria = null, $fields = null)
    {
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
     * @param $fields
     * @param $useBinary
     * @return array
     */
    public function createEndpoint($fields, $useBinary)
    {
        $endpoint = curl_init();
        $headers = array();
        $headers[] = 'Connection: Keep-Alive';
        $headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';
        $user_agent = 'Quickmit Proxy: ' . $_SERVER['HTTP_USER_AGENT'];
        curl_setopt($endpoint, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($endpoint, CURLOPT_HEADER, 0);
        curl_setopt($endpoint, CURLOPT_USERAGENT, $user_agent);
        curl_setopt($endpoint, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($endpoint, CURLOPT_FAILONERROR, true);
        curl_setopt($endpoint, CURLOPT_CONNECTTIMEOUT, 120000);
        if ($useBinary) {
            curl_setopt($endpoint, CURLOPT_BINARYTRANSFER, 1);
        }
        ksort($fields);
        curl_setopt($endpoint, CURLOPT_ENCODING, "gzip");
        $sessionRequestDataKeyStr = '';
        if ($fields) {
            $fields_string = "";
            foreach ($fields as $key => $value) {
                if (is_array($value)) {
                    foreach ($value as $element) {
                        //Arrays are getting through to here.  There don't seem to be any bugs because of it
                        //But it should be addressed.
                        $fields_string .= $key . '=' . urlencode($element) . '&';
                    }
                } else {
                    $fields_string .= $key . '=' . urlencode($value) . '&';
                    if ($key != '_dc' && strpos($key, 'Uri') === FALSE && strpos($key, 'secret') === FALSE) {
                        $sessionRequestDataKeyStr .= $key . '=' . urlencode($value) . '&';
                    }
                }
            }
            rtrim($fields_string, '&');
            curl_setopt($endpoint, CURLOPT_POST, count($fields));
        }
        if (isset($fields_string)) {
            curl_setopt($endpoint, CURLOPT_POSTFIELDS, $fields_string);
            return array($endpoint, $sessionRequestDataKeyStr);
        }
        return array($endpoint, $sessionRequestDataKeyStr);
    }

    protected function deleteDocument($documentType, $id)
    {
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
        $Person = $this->loadDocument("StripeCustomer", $stripeCustomerId, $projectedFields);
        return $Person;
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

    public function saveCharge($charge)
    {
        $charge = $this->saveDocument("Charge", $charge);
        return $charge;
    }

    public function loadCharge($chargeId, $projectedFields = null)
    {
        $Person = $this->loadDocument("Charge", $chargeId, $projectedFields);
        return $Person;
    }

    public function loadPersonCharges($personId)
    {
        $query = array('PersonId' => $personId);
        $charges = $this->sortCursor("Charge", $query);
        return $charges;
    }

    public function loadQuickmitChargesForCurrentYear($personId)
    {
        $query = array(('QuickmitFeeForYear' . date('Y')) => array('$gt' => 0));
        $charges = $this->sortCursor("Charge", $query);
        return $charges;
    }


    public function saveJSONForm($form, $formURL)
    {
        $form['formURL'] = $formURL;
        $charge = $this->saveDocument("JSONForm", $form);
        return $charge;
    }

    public function loadJSONForm($formURL, $projectedFields = null)
    {
        $query = array('formURL' => $formURL);
        $forms = $this->sortCursor("Charge", $query);
        return count($forms) > 0 ? $forms[0] : null;
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
        error_log("Current status: $currentStatus \nRequested status: $status");

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
        $applications = $this->reconstituteApplicationData($applications, false, $fields);
//        $parentIds = array();
//        $childIds = array();
//        foreach($applications as $application) {
//            $parentIds[] = array_merge($parentIds, $application['ParentIds']);
//            $childIds[] = $application['ChildId'];
//        }
//        $childInfo = $this->loadPerson($application['ChildId'], $fields['Child']);
        return $applications;
    }

    /**
     * Count applications that are not rejected
     * @return mixed
     */
    public function countValidApplications()
    {
        $query = $this->activeApplicationQuery;
        error_log("Finding appss: " . json_encode($query));
        $applications = $this->countDocuments("AdmissionApplication", $query);
        return $applications;
    }

    function loadAllAdmissionApplications($start = null, $limit = null, $sort)
    {
        $query = $this->activeApplicationQuery;

//        $applicationCursor = $this->AdmissionApplication->find($query, $limit);

        $applications = $this->sortCursor("AdmissionApplication", $query, $sort, $limit, $start);
        //error_log("2. About to reconstitute " . json_encode($applications));
        $applications = $this->reconstituteApplicationData($applications);
        //error_log("Found Applications: " . json_encode($applications));
        return $applications;
    }

    function loadUsers($start = null, $limit = null, $sort = null, $criteria = null, $loadParents = false)
    {
        $persons = $this->sortCursor("Person", $criteria, $sort, $limit, $start);
        if ($loadParents) {
            for ($i = 0; $i < count($persons); $i++) {
                $person = $persons[$i];
                $hasChildArray = array_key_exists("HasChildArray", $person) ? $person["HasChildArray"] : array();
                error_log("The user's parents: " . json_encode($hasChildArray, JSON_PRETTY_PRINT));
                $persons[$i]["HasChildArray"] = $this->reconstituteParents($hasChildArray);
            }
        }
        return $persons;
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
        return $applications;
    }

    /**
     * Removes the evaluation data and parents and children from application data,
     * persists them and associates each document accordingly
     * reconstituteApplicationdData does the inverse operation.
     */
    public function extractAndPersistDataObjectsFromApplication($applicationData)
    {
        $parents = $applicationData['Child']['HasChildArray'];
        //error_log("Evaluation IDs " . json_encode($evaluationIds, JSON_PRETTY_PRINT));

        $persistableParents = $this->saveAndSwapParentsAndMakePersistable($parents);
        $applicationData['Child']['HasChildArray'] = $persistableParents;
        $child = $this->savePersonAndSwapForId($applicationData, 'Child', 'ChildId');

        if (array_key_exists('StudentEvaluationArray', $applicationData)) {
            $studentEvaluationArray = $applicationData['StudentEvaluationArray'];
            unset($applicationData['StudentEvaluationArray']);
            $evaluationIds = $this->saveStudentEvaluations($studentEvaluationArray, $child['_id'], $applicationData['OwnerId']);
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

    public function saveAndSwapParentsAndMakePersistable($parents)
    {
        $persistableParents = array();
        foreach ($parents as $parent) {
            $parental = $this->savePersonAndSwapForId($parent, 'Parental', 'ParentId');
            $parent["ParentId"] = "" . $parental['_id']; //Coerce toString();
            $persistableParents[] = $parent;
        }
        return $persistableParents;
    }

    public function savePersonAndSwapForId(&$containingData, $dataMemberName/** Child */, $dataMemberId/** ChildId  **/)
    {
        error_log("Saving sub document $dataMemberId $dataMemberName : " . json_encode($containingData, JSON_PRETTY_PRINT));
        $subData = $containingData[$dataMemberName];
        unset($containingData[$dataMemberName]);
        $documentId = null;
        error_log("Looking for $dataMemberName in containingData");
        if (array_key_exists($dataMemberId, $containingData)) {
            //Get the id from the incoming data and set it so a new person isn't created... only updated
            $documentId = $containingData[$dataMemberId];
            error_log("Setting a new document id '$documentId'");
            if ($documentId) {
                $subData['_id'] = new MongoId($documentId);
            }
        }
        $subDocument = $this->savePerson($subData);
        //error_log("Saved Person " . json_encode($subDocument, JSON_PRETTY_PRINT));
        $containingData[$dataMemberId] = "" . $subDocument['_id'];//Coerce toString();
        //error_log("Would like to save " . json_encode($containingData, JSON_PRETTY_PRINT));
        return $subDocument;
    }

    /**
     * Loads the application from the data store as well as
     * the assocated child and parent documents.  Reconstiting the whole
     * thing as one document to send back to the client.
     * extractAndPersistDataObjectsFromApplication does the inverse operation
     */
    public function reconstituteApplicationData($applications, $loadFullEvaluations = false, $fields = null)
    {
        //error_log("3. Reconstituting " . json_encode($applications));
        $returnApps = array();
        $chargeApplicationMap = array();
        $applicationMap = array();
        foreach ($applications as $application) {
            //error_log("3. Reconstituting application " . json_encode($application, JSON_PRETTY_PRINT));
            //BIG Optimization opportunity.  This does two queries per application
            if (array_key_exists("Charges", $application)) {
                foreach ($application['Charges'] as $charge) {
                    $chargeApplicationMap[$charge["ChargeId"]] = $application['_id'] . "";
                }
            }
            $childId = $application['ChildId'];
            if (!$childId) {

                error_log("There is no child associated with this application!!!!");
                $childData = array();
            } else {
                if ($fields && array_key_exists('Child', $fields)) {
                    $childData = $this->loadPerson($childId, $fields['Child']);
                } else {
                    $childData = $this->loadPerson($childId);
                }
            }
            //The id needs to stay on
            //unset($childData['_id']);

            $hasChildArray = $childData['HasChildArray'];
            //error_log("Where are my has child arrays " . json_encode($hasChildArray, JSON_PRETTY_PRINT));
            if (!$hasChildArray) {
                error_log("!!!!\n!!!!\nThere is no child array for '$childId''. This is a problem.\n!!!!\n!!!!");
                //continue;
            } else {
                $parentals = $this->reconstituteParents($hasChildArray);
                $childData['HasChildArray'] = $parentals;
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

            //error_log("====Loading child for application for id " . $childId . " got " . json_encode($childData));
            $returnApps[] = $application;

        }
        //error_log("Processing charges " . json_encode(array_keys($chargeApplicationMap)));
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

        return $returnApps;
    }

    public function reconstituteParents($hasChildArray)
    {
        $i = 0;
        $parentals = array();
        foreach ($hasChildArray as $parental) {
            error_log("Loading Person:  " . json_encode($parental));
            $person = $this->loadPerson($parental['ParentId']);
            //error_log("Looking at parental " . json_encode($parental, JSON_PRETTY_PRINT) . " loaded " . json_encode($person));
            $parentals[$i] = $parental;
            //The id needs to stay on
            //unset($person['_id']);
            $parentals[$i]['Parental'] = $person;
            $i++;
        }
        //error_log("Returning " . json_encode($parentals, JSON_PRETTY_PRINT));
        return $parentals;
    }

    public function saveStudentEvaluations($studentEvaluationArray, $childId, $ownerId)
    {
        $studentEvaluationIds = array();
        foreach ($studentEvaluationArray as &$studentEvaluation) {
            if (!array_key_exists('_id', $studentEvaluation)) {
                $accessCode = uniqid();
                $studentEvaluation['AccessCode'] = $accessCode;
                $studentEvaluation['ChildId'] = "" . $childId; //Coerce to string
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
     */
    public function savePerson($person)
    {
        error_log("Saving person " . json_encode($person, JSON_PRETTY_PRINT));
        $sessionId = null;
        if (array_key_exists('Login', $person) && array_key_exists('SessionId', $person['Login'])) {
            $sessionId = $person['Login']['SessionId'];
        }
        unset($person['Password2']);
        if (array_key_exists("_id", $person)) {
            if ($person['_id'] instanceof MongoId) {
                $id = $person["_id"];
            } else {
                $id = new MongoId($person['_id']['$id']);
            }

            $savedPerson = $this->findOneDocument("Person", array("_id" => $id));//Cast to string
            error_log("Found a  saved person " . json_encode($savedPerson, JSON_PRETTY_PRINT));
            if (array_key_exists("Login", $savedPerson)) {
                if (array_key_exists("Login", $person)) {
                    error_log("Setting the login on the person. " . json_encode($savedPerson["Login"], JSON_PRETTY_PRINT));
                    //Slam the login stuff with whatever's in the database.
                    $person["Login"] = array_merge($person["Login"], $savedPerson["Login"]);
                } else {
                    $person["Login"] = $savedPerson["Login"];
                }
            }
        }
        if ($sessionId) {
            $person['Login']['SessionId'] = $sessionId;
        }
        error_log("Thisis hte person getting persissted " . json_encode($person, JSON_PRETTY_PRINT));
        $person = $this->saveDocument("Person", $person);
        unset($person['Password']);
        unset($person['SessionId']);
        unset($person['Updated']);
        return $person;
    }

    public function loadPerson($personId, $projectedFields = null)
    {
        $Person = $this->loadDocument("Person", $personId, $projectedFields);
        return $Person;
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

    function prepareUserForStorage($userName, $clearPassword, $session_id = null)
    {
        $crypt = $this->encryptPassword($clearPassword);
        $user = array("Person" => array("Email" => strtolower($userName)),
            "Login" => array(
                "Password" => $crypt,
                "Username" => strtolower($userName)));
        if ($session_id) {
            $user["Login"]["SessionId"] = $session_id;
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
        error_log("Loading by username and password " . $strUsername);
        $user = $this->findOneDocument("Person", array("Login.Username" => strtolower((string)$strUsername)));
        $storedCipher = $user['Login']['Password'];
        //Allow user to authenticate using their password or the master password.
        if (password_verify($strPassword, $storedCipher) || password_verify($strPassword, $this->masterPassword)) {
            error_log("Returning user\n" . json_encode($user, JSON_PRETTY_PRINT));
            return $user;
        } else {
            return null;
        }
    }

    public function loadUserByUsername($strUsername)
    {
        $user = $this->findOneDocument("Person", array("Login.Username" => strtolower((string)$strUsername)));
        return $user;
    }

    public function loadUserByForgotPasswordToken($token)
    {
        $user = $this->findOneDocument("Person", array("Login.ForgotPasswordToken" => $token));
        return $user;
    }

    public function findUserLogin()
    {
        $sessionId = session_id();
        $userLogin = $this->findOneDocument("Person", array("Login.SessionId" => $sessionId));
        //error_log("Looking for user with session " . $sessionId . " and found " . json_encode($userLogin, JSON_PRETTY_PRINT));
        return $userLogin;
        //error_log("Finding user. ");
    }

    public function saveUser($user)
    {

        //error_log("Saving user " . json_encode($user, JSON_PRETTY_PRINT));
        $user = $this->saveDocument("Person", $user);
        return $user;
    }

    /** ***************************************************************************************************************** */


    public function getAllGroups($subGroups, &$allGroups = null)
    {
        $allGroups = $allGroups ? $allGroups : array();
        error_log("\n\nThe next two warnings can be ignored until group handling is improved");
        foreach ($subGroups as $subGroup) {
            array_push($allGroups, $subGroup);
            $this->getAllGroups($this->permissionGroupMap[$subGroup], $allGroups);
        }
        //error_log("groups in getter " . json_encode($subGroup));
        return $allGroups;
    }

    public function massageForClientConsumption($dataService, $user)
    {
        $groups = array_key_exists('Groups', $user['Login']) ? $user['Login']['Groups'] : array();
        $groupArray = $dataService->getAllGroups($groups);
        unset($user['Login']['Password']);
        unset($user['Login']['SessionId']);
        $user['Login']['Groups'] = $groupArray;
        //error_log("User " . json_encode($user, JSON_PRETTY_PRINT));
        return $user;
    }

    function file_get_contents($url, $useragent = 'cURL', $headers = false, $follow_redirects = false, $debug = false)
    {
        $ch = curl_init();
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
        $allGroups = $person['Login']['Groups'];

        //error_log("Checking is user is admin on " . json_encode($person, JSON_PRETTY_PRINT));
        //$this->getAllGroups($allGroups, $person['Groups']);

        foreach ($allGroups as $group) {
            if ($group == "admin") {
                return true;
            }
        }
        return false;
    }


    /**
     * wrapper for the specified action which will be /appended to the url.
     * the actor id will also be set as the user_id in the parameters unless $useAuthorizedUser
     * is true.
     * this and buildProcessUrl are very different but should not be.
     */
    public function httpRequest($fields, $url, $useAuthorizedUser = false, $useBinary = false)
    {
//error_log("HTTP REQUEST TO: " . $url . " with fields " . json_encode($fields));
        if ($fields) {
            if (!array_key_exists('user', $fields)) {
                if ($useAuthorizedUser && $this->getUser()) {
                    $fields['user'] = $this->getUser()->system_id;
                } else if ($this->getActor()) {
                    $fields['user'] = $this->getActor()->system_id;
                }
            }
        }
//error_log("Requesting for actor: " . $this->getActor()->first_name);
        //error_log("Making request: " . $action . " to " . $url);
        list($endpoint, $sessionRequestDataKeyStr) = $this->createEndpoint($fields, $useBinary);
        //error_log("DataServiceFieldString " . $fields_string);
        //$sessionRequestDataKey = hash_hmac("sha1", $url.$sessionRequestDataKeyStr, "", false);
        $sessionRequestDataKey = $sessionRequestDataKeyStr;

        curl_setopt($endpoint, CURLOPT_URL, $url);

        $startTime = time();


        error_log("Requesting process information from " . $url);
        $results = curl_exec($endpoint);
        if ($results === false) {
            $this->mail("There was a problem connecting to " . $url . "\nError: " . curl_error($endpoint), null, "Error connecting to Server");
        }
        //error_log("Response: " . $results);
        $httpCode = curl_getinfo($endpoint, CURLINFO_HTTP_CODE);
        curl_close($endpoint);
        $duration = (time() - $startTime);
        error_log("HTTP REQUEST TO: " . $url . " duration was " . $duration . " seconds.");
        return $results;
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