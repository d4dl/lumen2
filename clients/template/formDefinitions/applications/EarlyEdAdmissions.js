[
    {
        html: "<span class='bigHeader printableBase'>" + Lumen.I18N_PROMPTS.earlyEdTitle + "</span>",
        cls: "headerBox"
    },
    {
        xtype: "baseapplication",
        layout: "fit",
        width: 688,
        introUrl: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/LetterEarlyEd.html",
        defaults: {
            autoHeight: true,
            xtype: 'appformloader'
        },
        applicationType: "EarlyEdAdmissions",
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
                title: Lumen.i18n("Educational Experience"),
                name: "ApplicationInformation",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/EducationalExperience.js"
            },
            {
                insertIndex: 220,
                title: Lumen.i18n("Parent's Perspective"),
                name: "ApplicationInformation",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ParentsPerspective.js"
            },
            {
                insertIndex: 225,
                title: Lumen.i18n("Survey of Special Needs"),
                name: "ApplicationInformation",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/SpecialNeeds.js"
            },
            {
                insertIndex: 230,
                title: Lumen.i18n("Teacher Recommendation"),
                required: true,//You can't specify required here.  You have to do it in the file the url refers to.
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/PersonalRecommendation.js"
            },
            {
                insertIndex: 240,
                title: Lumen.I18N_PROMPTS.TeacherEvaluation,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/TeacherEvaluationEarlyEd.js"
            },
            {
                insertIndex: 250,
                title: Lumen.i18n("Math Teacher Evaluation"),
                required: false,//You can't specify required here.  You have to do it in the file the url refers to.
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/MathEvaluation.js"
            },
            {
                insertIndex: 260,
                title: Lumen.i18n("English Teacher Evaluation"),
                required: false,//You can't specify required here.  You have to do it in the file the url refers to.
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/EnglishEvaluation.js"
            },
            {
                insertIndex: 300,
                title: "Additional Information",
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/AdditionalInformationEarlyEd.js"
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
