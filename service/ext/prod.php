<!DOCTYPE HTML>

<html>
<head>
    <meta charset="UTF-8">
    <title>Lumen</title>
    <script type="text/javascript">
        <?php

        require_once('clientConfig.php');
        require_once(CLIENT_DATA_DIR."/resources.js.php");
        ?>
    </script>
    <link rel="stylesheet" href="resources/prod.css"/>
    <script type="text/javascript" src="prod.js"></script>

    <!-- The build produces this
    <link rel="stylesheet" href="resources/MyApp-all.css"/>
    <script type="text/javascript" src="app.js"></script>
    -->
    <link rel="stylesheet" href="<?php echo STYLE_SHEET;?>">
</head>
    <body>
        <div id="lumenbody"/>
    </body>
    <script type="text/javascript" src="https://js.stripe.com/v1/"></script>
<!--    <script type="text/javascript" src="juicy.js"></script>-->
</html>
