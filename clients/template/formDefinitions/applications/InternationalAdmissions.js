[
    {
        html: "<span class='bigHeader printableBase'>High School Admission Application for International Students</span>" +
            "<br><span class='applicationInstruction'>"+Lumen.INSTRUCTIONS.howToCompleteForm+"</span>"
    },
    {
        xtype: "baseapplication",
        layout: "fit",
        width: 688,
        introUrl: Lumen.DATA_PREFIX + "/components/no.html",
        defaults: {
            autoHeight: true,
            xtype: 'appformloader'
        },
        applicationType: "HSMSAdmissions",
        applicationItems: [
            {
                insertIndex: 210,
                title: I18N_PROMPTS.EducationDetails,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/ChildDetailsHSMS.js"
            },
            {
                insertIndex: 220,
                title: I18N_PROMPTS.EducationHistory,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/HistoryHSMS.js"
            },
            {
                insertIndex: 230,
                title: I18N_PROMPTS.MathTeacherEvaluation,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/MathEvaluation.js"
            },
            {
                insertIndex: 240,
                title: I18N_PROMPTS.EnglishTeacherEvaluation,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/EnglishEvaluation.js"
            },
            {
                insertIndex: 250,
                title: I18N_PROMPTS.PersonalRecommendation,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/PersonalRecommendation.js"
            },
//            {
//                insertIndex: 2,
//                title: I18N_PROMPTS.InternationalStudentEligibilitySupplement",
//                completeSection: "necessary_for_completeness_verification",
//                url: Lumen.DATA_PREFIX + "/components/InternationalSupplement.js"
//            },
            {
                insertIndex: 260,
                title: I18N_PROMPTS.InternationalStudentInformation,
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.DATA_PREFIX + "/components/InternationalStudentHousing.js"
            }
        ]
    }
]
