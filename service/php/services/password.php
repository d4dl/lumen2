<?php
//require("DataService.php");
//$dataService = DataService::getInstance();
?>
<html>
    <head>

    </head>
    <body>
<form action="password.php">
    <table>
        <tr>
            <td>
                Password:
            </td>
            <td>
                <input name="password">
            </td>
        </tr>
    </table>
        <input type="submit"/>
</form>
    </body>
</html>
<?php

if(array_key_exists('password', $_REQUEST)) {

    $password = $_REQUEST['password'];
    $encryptedPassword = encryptThePassword($password);
    echo("<p/> Password: " . $password . "<br/> ". $encryptedPassword);
}

function encryptThePassword($clearPassword) {
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    //error_log("Crypting password " . $clearPassword);
    $crypt = crypt($clearPassword, '$6$rounds=5000$' . $salt . '$');
    return $crypt;
}
?>