<?php
include("head.php");

require_once("localConfig.php");

echo("Looking for $clientDirToCreate");
error_log("Looking for $clientDirToCreate");
$isUpdate = file_exists($clientDirToCreate);

if ($clientDirToCreate) {
    $_REQUEST["{__APPLICATION_FEE__}"] = $_REQUEST["{__APPLICATION_FEE__}"];
    $_REQUEST["{__CLIENT_BASE_URL__}"] = PROTOCOL . "://" . DOMAIN_NAME . "/clients/installation/" . $clientId;
    $_REQUEST["{__PROTOCOL__}"] = PROTOCOL;
    $_REQUEST["{__DOMAIN_NAME__}"] = DOMAIN_NAME;

    error_log("using client url " . $_REQUEST["{__CLIENT_BASE_URL__}"]);
    if(!$isUpdate) {
        mkdir($clientDirToCreate . "/uploads/applicationDocs", 0755, true);
    }
    chdir($lumenDir);
    $lumenDir = getcwd();


    chdir($clientDirToCreate);

    $clientDir = getcwd();
    if(!$isUpdate) {
        linksAndDirectories($lumenDir, $clientDir);
    }

    copyTemplates($lumenDir, $clientDir, $clientId);
    require("snippets.php");
} else {
    echo "no client id provided";
}


function linksAndDirectories($lumenDir, $clientDir)
{
    touch("php.log");
    chmod("php.log", 0755);

    exec("ln -s $lumenDir/service/ext/ext ext");
    exec("ln -s $lumenDir/service/ext/app app");
    exec("ln -s $lumenDir/service/ext/build/production/MyApp/app.js prod.js");
    exec("ln -s $lumenDir/service/ext/resources.js.php resources.js.php");
    exec("ln -s $lumenDir/service/src/js/burst.js burst.js");
    exec("ln -s $lumenDir/service/img img");
    exec("ln -s $lumenDir/service/php php");
    exec("ln -s $lumenDir/service/ext/index.php index.php");
    exec("ln -s $lumenDir/clients/template/build/style.css style.css");
    exec("ln -s $lumenDir/clients/template/build/emailStyle.css emailStyle.css");
    exec("ln -s build/production/MyApp/resources/ resources");
    exec("ln -s $lumenDir/service/ext/app.js app.js");
    error_log("Making directory $clientDir/build/production/MyApp/resources/images");
    exec("mkdir -p $clientDir/build/production/MyApp/resources/images");
    exec("mkdir build");
    exec("mkdir clientImg");
    exec("mkdir tokens");
}

function copyTemplates($lumenDir, $clientDir, $clientId)
{
    file_put_contents($clientDir . "/.user.ini", "include_path = .:/usr/home/d4dl/bin/php563/lib/php:$lumenDir/service/php:$clientDir:$clientDir/php\nerror_log = $clientDir/php.log");

    exec("cp $lumenDir/service/ext/bootstrap.css .");
    exec("cp $lumenDir/service/ext/bootstrap.js .");
    exec("cp $lumenDir/service/ext/bootstrap.json .");
    exec("cp $lumenDir/clients/template/build/clientStyle.css .");
    exec("cp $lumenDir/clients/template/build/clientEmailStyle.css .");
    exec("cp -r $lumenDir/clients/template/img/* $clientDir/clientImg");
    exec("cp -r $lumenDir/service/ext/build/production/* build/production");
    exec("cp -r $lumenDir/service/ext/ext/packages/ext-theme-gray/resources/images/* build/production/MyApp/resources/images/");
    exec("cp -r $lumenDir/service/ext/ext/packages/ext-theme-neptune/resources/images/* build/production/MyApp/resources/images/");
    exec("cp -r $lumenDir/service/ext/packages/ext-theme-gray-9a90b101-9a31-48ac-a224-71414fd6507e/resources/MyApp-all.css build/production/MyApp/resources/");

    exec("cp -r $lumenDir/service/ext/PROTOTYPE_ClientApplication.js $clientDir/ClientApplication.js");
    //Recursively delete all CVS directory.  The production dir structure should be deployed via cvs export.  Not Checkout.
    //find . -name 'CVS' -type d -exec rm -rf {} \;

    $templateDir = $lumenDir . "/clients/template";
    $clientBaseURL = PROTOCOL . "://" . DOMAIN . "/clients/installation/" . $clientId;

    recurseCopyAndSubstitute("$lumenDir/clients/template/formDefinitions/", "$clientDir/formDefinitions", $_REQUEST);
    recurseCopyAndSubstitute("$lumenDir/clients/template/templates/", "$clientDir/templates", $_REQUEST);
    copyAndSubstituteFile($lumenDir . "/clients/template/clientConfig.php", $clientDir . "/clientConfig.php", $_REQUEST);
    copyAndSubstituteFile($templateDir . "/templates/intro.html", $clientDir . "/templates/intro.html", $_REQUEST);
}


function copyAndSubstituteFile($srcFile, $destFile, $substitutions) {
    $content = file_get_contents($srcFile);
    foreach ($substitutions as $variable => $value) {
        $content = str_replace($variable, $value, $content);
    }
    file_put_contents($destFile, $content);
}

function recurseCopyAndSubstitute($srcDir, $destDir, $substitutions) {
    $dir = opendir($srcDir);
    @mkdir($destDir);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            $srcFile = $srcDir . '/' . $file;
            $destFile = $destDir . '/' . $file;
            if (is_dir($srcFile)) {
                recurseCopyAndSubstitute($srcFile, $destFile, $substitutions);
            } else {
                copyAndSubstituteFile($srcFile, $destFile, $substitutions);
            }
        }
    }
    closedir($dir);
}


?>
</body>
</html>
