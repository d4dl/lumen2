<html><head><title>Quickmit Tuition Management Platform</title>
    <style type="text/css"> #VWPLINK {display:none}</style>
    <?php require('../../../prod/clients/template/templates/baseTuitionStyleCSS.php'); ?>
</head>

    <body>

        <div align="center">
            <table width="750" border="0" style="border-collapse: collapse;background-color: #FFF;padding: 0px;margin: 0px; text-align:left;">
                <tbody><tr>



                    <td><a href="{__SCHOOL_URL__}">
                        <img src="{__CLIENT_BASE_URL__}/clientImg/yourlogo.png" width="502" height="106" border="0" class="logo" style="padding-left: 110px; padding-bottom:10px;margin-left: 10px;
	margin-top: 20px;"></a><a name="top"></a></td>
                    <td><table width="150" border="0" cellspacing="5" cellpadding="5" style="float:right; text-align:center;">
                        <tbody><tr>
                            <td style="font-size:12px;"><strong></strong></td>
                        </tr>
                        </tbody></table></td>
                </tr>
                <tr>
                    <td class="title" colspan="2" >
                        <table class="logoTable">
                            <tr class="titleWrapper">
                                <td>
                                    <h2 class="titleHeader">__TITLE__<br/> __DATE__ </h2>
                                </td>
                                <td class='logoWrapper'>
                                    <img src="http://quickmit.net/img/bigLogo.png" class="qmLogo">
                                    <div>Tuition Management Platform</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="content">
                        <p></p>
                        __content__
                        <p>
                    </td>
                </tr>


                </tbody></table>
        </div>
        <br><br>

        <br>
        <table bgcolor="#ffffff" padding="0" width="100%"><tbody><tr align="center"><td><table bgcolor="#ffffff" width="595"><tbody>

        <tr><td colspan="2"><font face="tahoma,sans-serif" size="1"><br>{__SCHOOL_ADDRESS__} | {__SCHOOL_CITY__} | {__SCHOOL_STATE__} | {__SCHOOL_ZIP__}</font>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        <br>

        <p/>
        <?php require_once("system_signature_template.php") ?>
    </body></html>