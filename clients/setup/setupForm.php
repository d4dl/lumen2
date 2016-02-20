<?php

ini_set("display_errors", 1);

error_log("School name " . SCHOOL_NAME);
require_once("localConfig.php");

if(defined('CLIENT_STRIPE_APPLICATION_FEE')) {
    $applicationFee = CLIENT_STRIPE_APPLICATION_FEE + "";
    $applicationFee = substr($applicationFee, 0, strlen($applicationFee) - 2);
} else {
    $applicationFee = "";
}

?>
<h3>Prospect Details</h3>
<h4>Lead prospect decision makers to schedule a call with Joshua
    by asking them to confirm below details (and/or just get the details):</h4>
<form action="configure.php">
    <table role="presentation" class="x-table-layout" cellspacing="0" cellpadding="0" id="ext-gen1721">
        <tbody>
        <tr>
            <td>
                <label for="{__SCHOOL_NAME__}">School Name:</label>
            </td>
            <td>
                <input type="text" name="{__SCHOOL_NAME__}" id="{__SCHOOL_NAME__}" value="<?php echo(defined('SCHOOL_NAME') ? SCHOOL_NAME : ''); ?>"/>
            </td>
        </tr>

        <tr>
            <td colspan="2" class="formCaption sectionRow">
                School name they use with parents.
            </td>
        </tr>
        <tr>
            <td colspan="4" rowspan="1" class="x-table-layout-cell ">
                <table class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-table-form-item x-form-invalid" style="width: 440px; table-layout: fixed;"
                       cellpadding="0" id="textfield-1217">
                    <tbody>
                    <tr role="presentation" id="textfield-1217-inputRow" class="x-form-item-input-row">
                        <td role="presentation" class="x-form-item-body widgetInputFieldWrapper " id="textfield-1217-bodyEl" colspan="2" class="formCaption" style="width: 100%;">
                            <div role="presentation" id="textfield-1217-labelCell" style="">
                                <label id="textfield-1217-labelEl" for="{__SCHOOL_ADDRESS__}" class="x-form-item-label x-unselectable x-form-item-label-top" unselectable="on">School
                                                                                                                                                                               Address:</label>
                            </div>
                            <input id="{__SCHOOL_ADDRESS__}" type="text" size="1" name="{__SCHOOL_ADDRESS__}" style="width: 100%;" value="<?php echo(defined('SCHOOL_ADDRESS') ? SCHOOL_ADDRESS : ''); ?>">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1" class="x-table-layout-cell sectionRow">
                <table class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-table-form-item" style="width: 170px; table-layout: fixed;" cellpadding="0"
                       id="textfield-1219">
                    <tbody>
                    <tr role="presentation" id="textfield-1219-inputRow" class="x-form-item-input-row">
                        <td role="presentation" class="x-form-item-body widgetInputFieldWrapper " id="textfield-1219-bodyEl" colspan="2" class="formCaption" style="width: 100%;">
                            <div role="presentation" id="textfield-1219-labelCell" style="">
                                <label id="textfield-1219-labelEl" for="{__SCHOOL_CITY__}" class="x-form-item-label x-unselectable x-form-item-label-top"
                                       unselectable="on">City:</label>
                            </div>
                            <input id="{__SCHOOL_CITY__}" type="text" size="1" name="{__SCHOOL_CITY__}" class="widgetInputField x-form-required-field x-form-text  "
                                   autocomplete="off" aria-invalid="false" data-errorqtip="" style="width: 100%;" value="<?php echo(defined('SCHOOL_CITY') ? SCHOOL_CITY : ''); ?>">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
            <td colspan="1" rowspan="1" class="x-table-layout-cell sectionRow">
                <table class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-table-form-item" style="width: 120px; table-layout: fixed;" cellpadding="0"
                       id="combobox-1220">
                    <tbody>
                    <tr role="presentation" id="combobox-1220-inputRow" class="x-form-item-input-row">
                        <td role="presentation" class="x-form-item-body widgetInputFieldWrapper " id="combobox-1220-bodyEl" colspan="2" class="formCaption" style="width: 100%;">
                            <div role="presentation" id="combobox-1220-labelCell" style="">
                                <label id="combobox-1220-labelEl" for="{__SCHOOL_STATE__}" class="x-form-item-label x-unselectable x-form-item-label-top"
                                       unselectable="on">State:</label>
                            </div>
                            <table id="combobox-1220-triggerWrap" class="x-form-trigger-wrap" cellpadding="0" cellspacing="0" style="width: 100%; table-layout: fixed;">
                                <tbody>
                                <tr>
                                    <td id="combobox-1220-inputCell" class="x-form-trigger-input-cell" style="width: 100%;">
                                        <div class="x-hide-display x-form-data-hidden" role="presentation" id="ext-gen1704"></div>
                                        <input id="{__SCHOOL_STATE__}" type="text" class="widgetInputField x-form-empty-field x-form-required-field x-form-text " autocomplete="off"
                                               name="{__SCHOOL_STATE__}" placeholder="State" aria-invalid="false" data-errorqtip="" style="width: 100%;" value="<?php echo(defined('SCHOOL_STATE') ? SCHOOL_STATE : ''); ?>">
                                    </td>
                                    <td valign="top" class=" x-trigger-cell x-unselectable" style="width:17px;" id="ext-gen1703">
                                        <div class="x-trigger-index-0 x-form-trigger x-form-arrow-trigger x-form-trigger-first" role="button" id="ext-gen1702"></div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
            <td colspan="1" rowspan="1" class="x-table-layout-cell sectionRow">
                <table class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-table-form-item" style="width: 100px; table-layout: fixed;" cellpadding="0"
                       id="textfield-1221">
                    <tbody>
                    <tr role="presentation" id="textfield-1221-inputRow" class="x-form-item-input-row">
                        <td role="presentation" class="x-form-item-body widgetInputFieldWrapper " id="textfield-1221-bodyEl" colspan="2" class="formCaption" style="width: 100%;">
                            <div role="presentation" id="textfield-1221-labelCell" style="">
                                <label for="{__SCHOOL_ZIP__}" class="x-form-item-label x-unselectable x-form-item-label-top" unselectable="on">Postal code:</label>
                            </div>
                            <input id="{__SCHOOL_ZIP__}" type="text" size="1" name="{__SCHOOL_ZIP__}" class="widgetInputField x-form-required-field x-form-text  "
                                   autocomplete="off" aria-invalid="false" data-errorqtip="" style="width: 100%;" value="<?php echo(defined('SCHOOL_ZIP') ? SCHOOL_ZIP : ''); ?>">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
    <table>
        <tr>
            <td>
                <label for="{__CURRENT_APPLICATION_FEE__}">Application Fee:</label>
            </td>
            <td>
                <input type="text" name="{__CURRENT_APPLICATION_FEE__}" id="{__CURRENT_APPLICATION_FEE__}" value="<?php echo(defined('CURRENT_APPLICATION_FEE') ? CURRENT_APPLICATION_FEE : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The annual amount the school charges parents now: initial applications and re-enrollments, <br/>and/
                or other annual fees, like student supplies and materials, etc. eg. 50
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__STUDENT_COUNT__}">Student enrollment count:</label>
            </td>
            <td class=''>
                <input type="text" name="{__STUDENT_COUNT__}" id="{__STUDENT_COUNT__}" value="<?php echo(defined('STUDENT_COUNT') ? STUDENT_COUNT : ''); ?>"/>
            </td>
        </tr>
        <!--        <tr>-->
        <!--            <td style="text-align: left">-->
        <!--                <label for="{__HS_MS__}">Include HSMS?</label>-->
        <!--                <input type="checkbox" name="{__STUDENT_COUNT__}" id="{__HS_MS__}" value="1"/>-->
        <!--            </td>-->
        <!--            <td>-->
        <!--                <label for="{__EARLY_ED__}">Include Early Ed?</label>-->
        <!--                <input type="checkbox" name="{__STUDENT_COUNT__}" id="{__EARLY_ED__}" value="1"/>-->
        <!--            </td>-->
        <!--        </tr>-->
        <tr>
            <td colspan="2" class="formCaption sectionRow">
                Annual students enrolled:
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__ADMIN_NAME__}">Admissions contact for parents:</label>
            </td>
            <td>
                <input type="text" name="{__ADMIN_NAME__}" id="{__ADMIN_NAME__}" value="<?php echo(defined('ADMIN_NAME') ? ADMIN_NAME : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The name of the administrator that welcomes families.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__ADMIN_TITLE__}">Their title:</label>
            </td>
            <td>
                <input type="text" name="{__ADMIN_TITLE__}" id="{__ADMIN_TITLE__}" value="<?php echo(defined('ADMIN_TITLE') ? ADMIN_TITLE : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                Formal position title at the school for emails to parents.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__ADMIN_EMAIL__}">Their Email:</label>
            </td>
            <td rowspan="2">
                <input type="text" name="{__ADMIN_EMAIL__}" id="{__ADMIN_EMAIL__}" value="<?php echo(defined('ADMIN_EMAIL') ? ADMIN_EMAIL : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The email of the administrator that welcomes families.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__ADMIN_SALUTATION__}">Email closing:</label>
            </td>
            <td>
                <input type="text" name="{__ADMIN_SALUTATION__}" id="{__ADMIN_SALUTATION__}" value="<?php echo(defined('ADMIN_SALUTATION') ? ADMIN_SALUTATION : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption sectionRow">
                e.g. 'Regards' or 'Yours Truly'
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__VISITOR_DAY_NAME__}">Campus Visit Day Name:</label>
            </td>
            <td>
                <input type="text" name="{__VISITOR_DAY_NAME__}" id="{__VISITOR_DAY_NAME__}" value="Guest Day" value="<?php echo(defined('VISITOR_DAY_NAME') ? VISITOR_DAY_NAME : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The name the school uses for the days that students visit. eg. 'Guest Days' or 'Day Visits'
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__CURRENT_ADMISSION_APPLICATION_URL__}">Application website address:</label>
            </td>
            <td>
                <input type="text" name="{__CURRENT_ADMISSION_APPLICATION_URL__}" id="{__CURRENT_ADMISSION_APPLICATION_URL__}" value="<?php echo(defined('CURRENT_ADMISSION_APPLICATION_URL') ? CURRENT_ADMISSION_APPLICATION_URL : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption sectionRow">
                The current URL parents use for getting school application details.
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <span class="importantInstructions">For lead prospecting, please <strong>disregard the following fields</strong>.  They are used during deployment.<hr/></span>
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__ADMISSION_APPLICATION_URL__}">Admission Application URL:</label>
            </td>
            <td>
                <input type="text" name="{__ADMISSION_APPLICATION_URL__}" id="{__ADMISSION_APPLICATION_URL__}" value="<?php echo(defined('APPLICATION_LINK') ? APPLICATION_LINK : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The url that links back to the application page.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__SCHOOL_URL__}">School Website URL:</label>
            </td>
            <td>
                <input type="text" name="{__SCHOOL_URL__}" id="{__SCHOOL_URL__}" value="<?php echo(defined('CLIENT_URL') ? CLIENT_URL : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The url to link to in applicant emails:
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__COORDINATOR_NAME__}">Coordinator Name:</label>
            </td>
            <td>
                <input type="text" name="{__COORDINATOR_NAME__}" id="{__COORDINATOR_NAME__}" value="<?php echo(defined('COORDINATOR_NAME') ? COORDINATOR_NAME : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                The name of the person that processes applications.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__COORDINATOR_EMAIL__}">Their Email:</label>
            </td>
            <td class=''>
                <input type="text" name="{__COORDINATOR_EMAIL__}" id="{__COORDINATOR_EMAIL__}" value="<?php echo(defined('COORDINATOR_EMAIL') ? COORDINATOR_EMAIL : ''); ?>"/>
            </td>
        </tr>
        <tr>
            <td class="formCaption sectionRow">
                The email of the person that processes applications.
            </td>
        </tr>
        <tr>
            <td>
                <label for="{__APPLICATION_FEE__}">Additional Application Fee:</label>
            </td>
            <td>
                <input type="text" name="{__APPLICATION_FEE__}" id="{__APPLICATION_FEE__}" value="<?php echo$applicationFee; ?>"/>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="formCaption">
                This is the amount over the $50.00 application Fee. If parents will be charges $75 enter 25 here.
            </td>
        </tr>
    </table>
    <input type="submit" value="Submit">
    <input type="hidden" name="{__CLIENT_ID__}" value="<?php echo $clientId; ?>">

</form>