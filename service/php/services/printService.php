<!DOCTYPE html>
<?php
//ini_set("display_errors", "on");
//require_once('util/vendor/composer/autoload_real.php');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
//header('Content-type: application/pdf');
header('Content-Type: text/html; charset=utf-8');
//header('Content-Description: File Transfer');

//ini_set("display_errors", true);

if(array_key_exists('develop', $_REQUEST)) {
    ?>
        <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
        <script type="text/javascript">
            $( window ).load(function() {
                var currentPageTop = 0;
                var pageHeight = 792;
                var printServiceWrapper = $("#printServiceWrapper");
                var level0Blocks = $(".fieldSetComponentSection.level1");
                $.each(level0Blocks, function(level1Block){
                    var block = $(level1Block);
                    var blockBottom = block.offset().top + block.height();
                    var maxBottom = pageHeight - currentPageTop;
                    if(blockBottom > (maxBottom)) {
                        currentPageTop += pageHeight;
                        block.parent().before("<div class='pageBreaker'></div>");
                    }
                });
            })
        </script>
    <?php
}


$applicationSections = $_REQUEST['applicationSection'];
//$fileName = $_REQUEST['filename'];
require_once("./DataService.php");
//require_once("../thirdparty/tcpdf/tcpdf.php");

//define('DOMPDF_ENABLE_AUTOLOAD', false);
//require_once '../vendor/dompdf/dompdf/dompdf_config.inc.php';

use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;
$dataService = DataService::getInstance();

//$cssToInlineStyles = new CssToInlineStyles();
//$css = file_get_contents(CLIENT_DATA_DIR . "/build/emailStyle.css");
//$cssToInlineStyles->setHTML($message);
//$cssToInlineStyles->setCSS($css);
//$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

//$stylesheet = '<style>'.file_get_contents(STYLE_SHEET).'</style>';
//$pdf->writeHTML($stylesheet, true, false, true, false, '');

//$pdf->writeHTML($html, true, false, true, false, '');

foreach($applicationSections as $applicationSection) {
    //$pdf->AddPage();
//
    $cssToInlineStyles = new CssToInlineStyles();
    $css = file_get_contents(CLIENT_DATA_DIR . "/emailStyle.css");
    $css .= file_get_contents(CLIENT_DATA_DIR . "/clientEmailStyle.css");
    $cssToInlineStyles->setHTML($applicationSection);
    $cssToInlineStyles->setCSS($css);
    $inlinedHTML = $convertedMessage = $cssToInlineStyles->convert();

    $baseTemplate = CLIENT_DATA_DIR . "/templates/printHtml.php";
    $templateContents = file_get_contents($baseTemplate);
    $document = str_replace("__content__", $inlinedHTML, $templateContents);
//    error_log("Executing html " . $inlinedHTML);
////    $pdf->writeHTML($inlinedHTML, true, false, true, false, '');
//    $dompdf = new DOMPDF();
//    $dompdf->load_html($inlinedHTML);
//    $dompdf->render();
//    $dompdf->stream($fileName);
    echo "<div id='printServiceWrapper'>".$document."</div>";
}

//$pdf->Output($fileName, 'D');

?>