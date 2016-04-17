<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json;charset=UTF-8');


define("NO_HANDLE_ERRORS", true);
require("./DataService.php");
$dataService = DataService::getInstance();
error_log("\n\n\n!!!! LOGIN PROCESSING Auth::: ");

$PCI_COMPLIANT_LOGIN_ATTEMPT_AGE = 30;

if(array_key_exists("action", $_GET) && $_GET['action'] == 'logout') {
    $userLogin = $dataService->findUserLogin();
    setcookie(session_id(), null, -1);
    session_destroy();
    session_write_close();;
    $dataService->savePerson($userLogin, null, true);
    header("Location: ".APP_ENTRY_URL);
    exit;
}


error_log("!!!! LOGIN PROCESSING Authenticate: " . json_encode($_REQUEST));
if(array_key_exists("formData", $_REQUEST)) {
    $formData = json_decode($_REQUEST['formData']);
    if(!is_string($formData) && array_key_exists("urlEncoded", $formData) && $formData->urlEncoded) {
        foreach ($formData as $key => $value) {
            $formData->$key = urldecode($value);
        }
    }
    $action = $formData->authAction;
} else if(array_key_exists('action', $_REQUEST)) {
    $action = $_REQUEST['action'];
} else {
    $action="find";
}

$output = "[]";

switch($action) {
    case 'login': {
        //error_log("!!!! LOGIN PROCESSING --Login with action ");
        if(array_key_exists("tokenSet", $_REQUEST)) {
            //Step 1. CALL USING window.open() User login create a session and a token.
            //The client should launch this from a popup to get around browsers that
            //restrict iframed code from setting cookies
            error_log("!!!! LOGIN PROCESSING 1. Logging in with tokenSet for " . $formData->Username . ":". $_REQUEST['tokenSet']);
            loginAndSetUserToken($dataService, $formData->Username, $formData->Password);
        } else if(array_key_exists("tokenGet", $_REQUEST)) {
            //Step 3. the client makes a request to get the token.
            //Waiting for the token to be confirmed when the popup redirects from step2.
            error_log("!!!! LOGIN PROCESSING 3. TokenGet for " . $_REQUEST['tokenGet']);
            $output = finishTokenProcessing($dataService);
        }

        break;
    }
    case 'completeTokenProcessing': {
        $sessionId = session_id();
        //error_log("!!!! LOGIN PROCESSING 2. Completing Token Processing and setting cookie for authorized users. Out of band session id is $sessionId");
        //Launched by the redirect initiated by login?action=tokenSet to rename the token
        //File wo tokenGet can stop its sleep cycle and allow the main client to move on
        $token = $_REQUEST['token'];
        error_log("!!!! LOGIN PROCESSING 2. TokenGet for " . $token);
        $tokenToConfirm = waitForToken($token, "token");
        updateToken($token, "token", "confirmed");
        header('Content-type: text/html;charset=UTF-8');
        $output = "<html></html><head><script type='text/javascript'>window.close()</script></head><body></body>";

        $loginRequestSessionId = session_id();
        //error_log("!!!! LOGIN PROCESSING Token confirm wit session id with user " . $loginRequestSessionId);
        break;
    }
    case 'create': {
        //Weirdly, this script will be executed twice.
        //once with a GET and once with a POST even though the client issued a POST.
        $user = null;
        error_log("Why is create being called ?\n" . json_encode($_REQUEST));
        if(array_key_exists("tokenSet", $_REQUEST)) {
            error_log("!!!! LOGIN PROCESSING Create token for " . $_REQUEST['tokenSet']);
            $loginUser = $dataService->loadUserByUsername($formData->Username);
            if(!$loginUser) {
                $session_id = session_id();
                if(!$session_id) {
                    $session_id = session_id();
                    //error_log("!!!! LOGIN PROCESSING Started session " . $session_id);
                }
                $userName = (string)$formData->Username;
                $clearPassword = $formData->Password;
                $user = $dataService->prepareUserForStorage($userName, $clearPassword, $session_id, $loginUser['systemId']);
                $user['login']["groups"] = array();
                $user = $dataService->savePerson($user);
                error_log("!!!! LOGIN PROCESSING Saved Person: " . json_encode($user));
                $loginJSON = $dataService->massageForClientConsumption($dataService, $user);
                $output = json_encode($loginJSON);
            }
            setUserToken($dataService, $user, "The username you specified already exists.");
        } else if(array_key_exists("tokenGet", $_REQUEST)) {
            error_log("!!!! LOGIN PROCESSING Get token for " . $_REQUEST['tokenGet']);
            $output = finishTokenProcessing($dataService, $message);
        }
        break;
    }
//    case 'saveSelf': {
//        $userLogin = $dataService->findUserLogin();
//        if($userLogin != null) {
//            $personData = json_decode($formData->person, true);
//            $person = array("Person"=>array(), "Login"=>array());
//            $person["Person"]["Title"] = $personData["Person.Title"];
//            $person["Person"]["FirstName"] = $personData["Person.FirstName"];
//            $person["Person"]["LastName"] = $personData["Person.LastName"];
//            $person["Person"]["NameSuffix"] = $personData["Person.NameSuffix"];
//            $person["Person"]["Email"] = strtolower($personData["Person.Email"]);
//            $person["Person"]["Gender"] = $personData["Person.Gender"];
//
//            if($personData["Password"]) {
//                $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
//                error_log("!!!! LOGIN PROCESSING *** Crypting " . $personData["Password"]);
//                $person["Login"]["Password"] = crypt($personData["Password"], '$6$rounds=5000$'.$salt.'$');
//            }
//            $person["Login"]["Username"] = strtolower((string)$personData["Username"]);
//            error_log("!!!! LOGIN PROCESSING Saving Person " . json_encode($person));
//            $person = $dataService->savePerson($person);
//        } else {
//            DataService::setHTTPStatus(401, "You are not authenticated.");
//        }
//        break;
//    }
    case 'redeem': {
        error_log("!!!! LOGIN PROCESSING REDEEMING ");
        $user = $dataService->loadUserByForgotPasswordToken($_REQUEST['token']);
        if($user) {
            //error_log("!!!! LOGIN PROCESSING Found the user");
            $user["login"]["forgotPasswordToken"] = null;
            session_start();
            $user["login"]["sessionId"] = session_id();
            $user = $dataService->savePerson($user);
            $loginJSON = $dataService->massageForClientConsumption($dataService, $user);
            $output = json_encode($loginJSON);
            header("Location: ".APPLICATION_LINK."?userInfo=true");
        } else {
            DataService::setHTTPStatus(403, "The account link you used is no longer valid");
        }
        break;
    }
    case 'forgotPassword': {
        $user = $dataService->loadUserByUsername($formData->Username);
        if($user) {
            $token = uniqid();
            $user["login"]["forgotPasswordToken"] = $token;
            $user = $dataService->savePerson($user);
            $loginJSON = $dataService->massageForClientConsumption($dataService, $user);
            $output = json_encode($loginJSON);
        } else {
            $output = "{'newAccount': 'true'}";
        }
        break;
    }
    case 'person':
    case 'find': {
        $login = $dataService->findUserLogin();

        //error_log("!!!! LOGIN PROCESSING find Getting user login attempt count " . incrementLoginAttemptCount($formData->Username));
        error_log("!!!! LOGIN PROCESSING Calling FIND and returning user: " .  json_encode($login));
        if($login) {
            $loginJSON = $dataService->massageForClientConsumption($dataService, $login);
            if($login != null) {
                $output = json_encode($loginJSON);
            } else {
                DataService::setHTTPStatus(401, "You are not authenticated.");
            }
        }
        break;
    }
    case 'get': {
        error_log("!!!! LOGIN PROCESSING get Getting user login attempt count " . incrementLoginAttemptCount($formData->Username));
        $userLogin = $dataService->findUserLogin();
        if($userLogin != null) {
            $loginJSON = $dataService->massageForClientConsumption($dataService, $userLogin);
            $output = json_encode($loginJSON);
        } else {
            DataService::setHTTPStatus(401, "You are not authenticated.");
        }
    break;
    }
}

if(array_key_exists("callback", $_REQUEST)) {
    $output = $_REQUEST["callback"] . "(".$output.")";
}
echo $output;

function curPageURL() {
    return URL_STEM."/php/services/authenticate.php";
}


function waitForToken($token, $tokenState) {
    $tokenToConfirm = getTokenFileName($token, $tokenState);
    $maxWait = 15;//5 seconds
    $start = microtime(true);
    $nextTime = 0;
    $maxWaitExceeded = false;
    while (!file_exists($tokenToConfirm) && !$maxWaitExceeded) {
        usleep(100000); //.1 seconds
        $nextTime = microtime(true);
        $duration = $nextTime - $start;
        $maxWaitExceeded = $duration > $maxWait;
    }
    if($maxWaitExceeded) {
        $message = "Authenticate.php failed because waitForToken exceeded maximum wait time.\nClient: " . CLIENT_DATA_DIR . "\nRequest: ". json_encode($_REQUEST);
        error_log($message);
        //error_log($message, 1, SYS_ADMIN_EMAIL);
    } else {
        if(file_exists($tokenToConfirm)) {
            error_log("!!!! LOGIN PROCESSING Token waited for and found " . $tokenToConfirm);
        } else {
            error_log("!!!! LOGIN PROCESSING Token was never found " . $tokenToConfirm);
        }
    }
    return $tokenToConfirm;
}

function updateToken($token, $fromState, $toState) {
    $fromToken =  getTokenFileName($token, $fromState);
    $toToken = getTokenFileName($token, $toState);
    //error_log("!!!! LOGIN PROCESSING 2. Renaming " . $fromToken . "\nto\n" . $toToken);
    rename($fromToken, $toToken);
}

function consumeToken($token, $tokenState) {
    $tokenFileName = waitForToken($token, "confirmed");
    $userJSON = file_get_contents($tokenFileName);
    //error_log("!!!! LOGIN PROCESSING 3. Consuming token for $tokenFileName\n" . $userJSON);
    unlink($tokenFileName);
    if(isset($userJSON)) {
        return json_decode($userJSON, true);
    } else {
        return array();
    }
}


function createToken($token, $user, $errorMessage) {
    $newToken = CLIENT_DATA_DIR . "/tokens/" . $token . ".token";
    $fileContents = isset($user) ? $user : array("errorMessage" => $errorMessage);
    file_put_contents($newToken, json_encode($fileContents, JSON_PRETTY_PRINT));
    //error_log("!!!! LOGIN PROCESSING 1. Created token " . $newToken);
    touch($newToken);
}

function getTokenFileName($token, $tokenState) {
    return CLIENT_DATA_DIR . "/tokens/" . $token . ".$tokenState";
}

function resetLoginAttemptCount($userName) {
    $attemptCountFile = getLoginAttemptCountFilename($userName);
    error_log("!!!! LOGIN PROCESSING Resetting attempt count");
    unlink($attemptCountFile);
}


function getLoginAttemptCount($userName) {
    $attemptCountFile = getLoginAttemptCountFilename($userName);
    $count = 1;
    global $PCI_COMPLIANT_LOGIN_ATTEMPT_AGE;
    if(file_exists($attemptCountFile)) {
        $currentTime = time();
        $lastModified = filemtime($attemptCountFile);
        $lastAttemptAge = $currentTime - $lastModified;
        error_log("!!!! LOGIN PROCESSING $attemptCountFile was last modified: " . $lastModified . " current time is: " . $currentTime . ". That's " . $lastAttemptAge . "s ago.");
        if($lastAttemptAge > $PCI_COMPLIANT_LOGIN_ATTEMPT_AGE * 60) {
            error_log("!!!! PCI COMPIANCE BLOCK.  TO MANY ATTEMPTS LOGIN PROCESSING But its older than " . $PCI_COMPLIANT_LOGIN_ATTEMPT_AGE . "m old. So more attempts can be made.");
            resetLoginAttemptCount($userName);
        } else {
            $count = file_get_contents($attemptCountFile);
        }
    }
    //return $count;
    return 0;
}

function incrementLoginAttemptCount($userName) {
    $attemptCountFile = getLoginAttemptCountFilename($userName);
    error_log("!!!! LOGIN PROCESSING Examining file: " . $attemptCountFile);
    $count = getLoginAttemptCount($userName);
    error_log("!!!! LOGIN PROCESSING Current login count " . $count);
    $new_count = "" . ($count + 1);
    file_put_contents($attemptCountFile, "" . $new_count);
    error_log("!!!! LOGIN PROCESSING Just put new count $new_count into $attemptCountFile");
    return $count;
}

function getLoginAttemptCountFilename($userName) {
    $scrubbedUserName = preg_replace("/[^A-Za-z0-9 ]/", '', $userName);
    $attemptCountFile = CLIENT_DATA_DIR . "/tokens/loginAttempt" . $scrubbedUserName;
    return $attemptCountFile;
}


function loginAndSetUserToken($dataService, $username, $password) {
    $user = null;
    global $PCI_COMPLIANT_LOGIN_ATTEMPT_AGE;
    $attemptCount = incrementLoginAttemptCount($username);
    if($attemptCount >= 6) {
        $errorMessage = "Too many login attempts. You may reset your password but you must wait $PCI_COMPLIANT_LOGIN_ATTEMPT_AGE minutes to login again.";
    } else {
        $user = $dataService->loadUserByUsernameAndPassword($username, $password);
        $errorMessage = "The user name or password you entered is incorrect.";
    }
    setUserToken($dataService, $user, $errorMessage);
}


/**
 * If the user's set just use it. Otherwise try to authenticat the user.
 * @param $dataService
 * @param $user
 * @param $username
 * @param $password
 */
function setUserToken($dataService, $user, $errorMessage) {
    $token = $_REQUEST['tokenSet'];
    if (isset($user)) {
        $loginRequestSessionId = session_id();
        createToken($token, $user, $errorMessage);
        $dataService->savePerson($user, $loginRequestSessionId);
        error_log("!!!! LOGIN PROCESSING 1. Setting Token for user " . json_encode($user, JSON_PRETTY_PRINT) . "only valid user gets the session id persisted for them");
        //error_log("!!!! LOGIN PROCESSING User is authenticated and login should proceed with session $loginRequestSessionId!!!!");
    }  else {
        createToken($token, null, $errorMessage);
    }
    //Redirect to verifySession (see below) to set session cookie. If the session maps to a user the subsequent
    //call to get verified session will succeed. Needs to happen wether they're authorized or not.
    //error_log("!!!! LOGIN PROCESSING Token set is being called.");
    $newLocation = "Location: " . curPageURL() . "?action=completeTokenProcessing&token=" . $token;
    error_log("New location: $newLocation");
    $newLocation = $newLocation;
    //error_log("!!!! LOGIN PROCESSING Location built: redirecting.");
    header($newLocation);
}

function finishTokenProcessing($dataService) {
    $token = $_REQUEST['tokenGet'];
    $potentialUser = consumeToken($token, "confirmed");
    $hasErrorMessage = array_key_exists('errorMessage', $potentialUser);
    error_log("!!!! LOGIN PROCESSING Examining potential user " . json_encode($potentialUser)  . " for token: " . $token);
    if(!$hasErrorMessage) {
        $username = $potentialUser['login']['username'];
        if($username) {
            $userLogin = $dataService->loadUserByUsername($username);
            error_log("!!!! LOGIN PROCESSING 4. Getting Token. Cookie should be set. Potential User from the previously consumed token being compared to " .
                "\nLogin loaded from the token\n" . json_encode($potentialUser, JSON_PRETTY_PRINT));
            if ($userLogin != null) {
                $loginRequestSessionId = session_id();
                error_log("!!!! LOGIN PROCESSING Associating session id with user " . $loginRequestSessionId);
                $dataService->savePerson($userLogin, $loginRequestSessionId);

                $loginJSON = $dataService->massageForClientConsumption($dataService, $userLogin);
                $output = json_encode(array("Person"=>$loginJSON));
                resetLoginAttemptCount($username);
                return $output;
            }

        }
    }

    if(isset($hasErrorMessage)) {
        //error_log("!!!! LOGIN PROCESSING sending down error message" . $potentialUser['errorMessage']);
        DataService::setHTTPStatus(401, $potentialUser['errorMessage']);
        echo $potentialUser['errorMessage'];
    }
}


?>