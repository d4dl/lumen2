<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lumen</title>
    <script type="text/javascript" src="https://js.stripe.com/v1/"></script>
    <script type="text/javascript" src="juicy.js"></script>
    <script type="text/javascript">
        <?php
        //error_log("Loading index.psp");
        $client = "ksi";
        $clientDir = "../clientData/".$client;
        $stylesheet = $clientDir ."/build/style.css";
        require_once($clientDir."/config.php");
        require_once($clientDir."/resources.js.php");
        ?>
    </script>

    <link rel="stylesheet" href="<?php echo $clientDir; ?>/build/add-style.css">
    <link rel="stylesheet" href="<?php echo $clientDir; ?>/build/style.css">
<!--    <link rel="stylesheet" href="--><?php //echo $clientDir; ?><!--/build/match.css">-->
    <!-- <x-compile> -->
        <!-- <x-bootstrap> -->
           <!-- <link rel="stylesheet" href="bootstrap.css"> -->

            <script src="ext/ext-dev.js"></script>
            <script src="bootstrap.js"></script>
        <!-- </x-bootstrap> -->
        <script src="app.js"></script>
    <!-- </x-compile> -->
</head>
<body>

  <div id="lumenbody"/>
</body>
</html>
