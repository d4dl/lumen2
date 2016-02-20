[
    {
        html: "<span class='bigHeader printableBase'>Middle &amp; High School Admission Application</span>",
        cls: "headerBox"
    },
    {
        xtype: "baseapplication",
        showGuestDaysPanel: true,
        layout: "fit",
        width: 688,
        introUrl: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/no.html",
        defaults: {
            autoHeight: true,
            xtype: "appformloader"
        },
        applicationType: "HSMSAdmissions",
        applicationItems: [
            {
                title: Lumen.i18n("Child's Information"),
                insertIndex: 100,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ChildInformation.js"
            },
            {
                insertIndex: 200,
                title: Lumen.i18n("Parent Information"),
                name: "Child",
                completeSection: "necessary_for_completeness_verification",
                canDuplicate: true,
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ParentInformation.js"
            },
            {
                insertIndex: 210,
                title: Lumen.i18n("Education Details"),
                name: "ApplicationInformation",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ChildDetailsHSMS.js"
            },
            {
                insertIndex: 220,
                title: "Education History",
                name: "ApplicationInformation",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/HistoryHSMS.js"
            },
            {
                insertIndex: 230,
                title: Lumen.i18n("Math Teacher Evaluation"),
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/MathEvaluation.js"
            },
            {
                insertIndex: 240,
                title: Lumen.i18n("English Teacher Evaluation"),
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/EnglishEvaluation.js"
            },
            {
                insertIndex: 250,
                title: Lumen.i18n("Teacher Recommendation"),
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/PersonalRecommendation.js"
            },
            {
                insertIndex: 300,
                title: "Additional Information",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/AdditionalInformation.js"
            },
            {
                title: "Signature",
                insertIndex: 999,
                border: false,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/Signature.js"
            }
        ]
    }
]
