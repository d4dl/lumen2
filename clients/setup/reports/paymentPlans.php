
<?php

define('CLIENT_ID', $_REQUEST['clientId']);
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=khabelestrongpaymentplans.csv");
            header("Pragma: no-cache");
            header("Expires: 0");

            $delimiter = ",";
//require_once("../../../service/php/services/DataService.php");
$mongo = new MongoClient("mongodb://quickmit:XdAJfcQjCUGRPU2EZgCnwQc0fmG4lBToRDJFHN@127.0.0.1:27017");
//$mongoDB = $mongo->khabelestrong;

$criteria = array("isActive"=>true);

$headers  = array("Count", "Student First", "Student Last", "Parent First", "Parent Last", "Email", "Plan Description", "Net Tuition", "Scholarship", "Total Paid using Quickmit", "Quickmit Fee", "Total Deposit", "Additional Checks" ,"Balance Due");//, "To be current");

for($h=0; $h < count($headers); $h++) {
    echo($headers[$h] . $delimiter);
}
echo("\n");

//$criteria = array("isActive"=>true);
$criteria = array();
$debitSchedules = iterator_to_array($mongoDB->DebitSchedule->find($criteria), false);
outputSchedules($debitSchedules, $delimiter, $mongoDB);
echo("\n");
//$criteria = array('$or'=>array(array('isActive'=>array()),array()));
//
//$debitSchedules = iterator_to_array($mongoDB->DebitSchedule->find($criteria), false);
//outputSchedules($debitSchedules, $delimiter, $mongoDB);

function outputSchedules($debitSchedules, $delimiter, $mongoDB) {
    for ($i = 0; $i < count($debitSchedules); $i++) {
        $debitSchedule = $debitSchedules[$i];
        //echo("Processing Schedule " . json_encode($debitSchedule, JSON_PRETTY_PRINT));
        $child = $mongoDB->Person->findOne(array("_id" => new MongoId($debitSchedule["ChildId"])));

        $ownerId = $debitSchedule["OwnerId"];
        if($ownerId  && strpos($ownerId, "David") === false) {
            echo($i . $delimiter);
            //echo("<br/>Owner ID: $ownerId");
            $parent = $mongoDB->Person->findOne(array("_id" => new MongoId($ownerId)));
            echo($child["Person"]["FirstName"] . $delimiter);
            echo($child["Person"]["LastName"] . $delimiter);
            echo($parent["Person"]["FirstName"] . $delimiter);
            echo($parent["Person"]["LastName"] . $delimiter);
            echo($parent["Person"]["Email"] . $delimiter);
            echo("\"" . $debitSchedule["description"] . "\"" . $delimiter);
            $debitScheduleEntries = $debitSchedule['debitScheduleEntries'];

            $today = time();
            $totalCalculated = array_key_exists("downPaymentAmount", $debitSchedule) ? $debitSchedule["downPaymentAmount"] : 0;
            $totalPaid = 0;
            $fees = $debitSchedule['fees'];
            for ($j = 0; $j < count($fees); $j++) {
                $feeModel = $fees[$j];
                if (array_key_exists("amount", $feeModel) && $feeModel['amount'] > 0) {
                    $amount = $feeModel['amount'];
                    $totalCalculated += $amount;
                }
            }

            $totalToBeCurrent = $totalCalculated;
            for ($k = 0; $k < count($debitScheduleEntries); $k++) {
                $entryModel = $debitScheduleEntries[$k];
                $debitAmount = array_key_exists("debitAmount", $entryModel) ? $entryModel["debitAmount"] : 0;
                //echo("\nProcessing entry amount $debitAmount\n");
                $executedDate = array_key_exists("executedDate", $entryModel) ? $entryModel["executedDate"] : null;
                $dateToExecute = array_key_exists("dateToExecute", $entryModel) ? $entryModel["dateToExecute"] : null;

                if ($dateToExecute) {
                    $totalCalculated += $debitAmount;
                }

                if ($executedDate) {
                    $totalPaid += $debitAmount;
                    $totalToBeCurrent = $totalToBeCurrent - $debitAmount;
                }

                if ($dateToExecute && $dateToExecute < $today) {
                    $totalToBeCurrent += $debitAmount;
                }
            }
            ;
            $balanceDue = $totalCalculated - $totalPaid;
            $quickmitFee = $totalPaid * .03;

            echo($totalCalculated . $delimiter);
            echo(",");
            echo($totalPaid . $delimiter);
            echo($quickmitFee . $delimiter);
            echo($totalPaid - $quickmitFee . $delimiter);
            echo($delimiter);
            echo($balanceDue . $delimiter);
            //if($totalToBeCurrent > 0) {
            //    echo($totalToBeCurrent . $delimiter);
            //}

            echo("\n");
        }
    }
}

?>
