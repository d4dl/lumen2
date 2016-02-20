<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
?>

<!DOCTYPE HTML>

<html>
<head>
    <meta charset="UTF-8">
    <title>Lumen</title>
    <script type="text/javascript">
        <?php
        require_once('clientConfig.php');
        ?>

    </script>
    <script src="resources.js.php?version=<?php echo SERVER_VERSION; ?>"></script>
    <script type="text/javascript" src="ClientApplication.js?version=<?php echo SERVER_VERSION; ?>"></script>
    <?php if(IS_PRODUCTION) {?>
        <link rel="stylesheet" href="resources/MyApp-all.css?version=<?php echo SERVER_VERSION; ?>"/>
        <script type="text/javascript" src="prod.js?version=<?php echo SERVER_VERSION; ?>"></script>
    <?php } else {?>
        <!-- <x-compile> -->
            <!-- <x-bootstrap> -->
                <link rel="stylesheet" href="bootstrap.css">
                <script src="ext/ext-dev.js"></script>
                <script src="bootstrap.js"></script>
            <!-- </x-bootstrap> -->
            <script type="text/javascript" src="app.js?version=<?php echo SERVER_VERSION; ?>"></script>
        <!-- </x-compile> -->
    <?php }?>


    <link rel="stylesheet" href="style.css?version=<?php echo SERVER_VERSION; ?>">
    <link rel="stylesheet" href="clientStyle.css?version=<?php echo SERVER_VERSION; ?>">
</head>
    <body>
        <div id="lumenbody"/>
    </body>

<script type="text/javascript" src="https://js.stripe.com/v1/"></script>
<!--<script type="text/javascript" src="juicy.js"></script>-->

</html>
