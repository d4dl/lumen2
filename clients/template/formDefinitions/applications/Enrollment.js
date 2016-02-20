[
    {
        html: "<span class='bigHeader printableBase'>Enrollment</span>",
        cls: "headerBox"
    },
    {
        xtype: "jsonformcontainer",
        frame: true,
        autoHeight: true,
        cls: "applicationPanel completionTabPanel",
        autoDestroy: true,
        applicationType: "Enrollment",
        defaults: {
            autoHeight: true,
            xtype: "appformloader"
        },
        items: [
            {
                xtype: "container",
                layout: {
                    // layout-specific configs go here
                    type: 'accordion',
                    animate: true
                },
                title: Lumen.i18n("Operational Information"),
                introUrl: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/no.html",
                defaults: {
                    autoHeight: true,
                    xtype: "appformloader"
                },
                items: [
                    {
                        insertIndex: 360,
                        title: Lumen.i18n("Contact and Pickup"),
                        saveableDocument: true,
                        name: "ContactAndPickup",
                        buttonText: "Save",
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/ContactAndPickup.js"
                    },
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Background Check"),
                        completeSection: "necessary_for_completeness_verification",
                        saveableDocument: true,
                        name: "BackgroundCheck",
                        buttonText: "Save Background Check",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/BackgroundCheck.js"
                    },
                    //                    {
                    //                        insertIndex: 350,
                    //                        title: Lumen.i18n("Growing Together Consent"),
                    //                        completeSection: "necessary_for_completeness_verification",
                    //                        defaults: {
                    //                            cls: 'formContentWrapper'
                    //                        },
                    //                        modelToLoad: {},
                    //                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/GrowingTogether.js"
                    //                    },
                    {
                        insertIndex: 370,
                        title: Lumen.i18n("Food Allergies"),
                        saveableDocument: true,
                        name: "FoodAllergies",
                        buttonText: "Save",
                        completeSection: "necessary_for_completeness_verification",
                        defaults: {
                        },
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/FoodAllergies.js"
                    }
                ]
            },
            {
                xtype: "panel",
                layout: {
                    // layout-specific configs go here
                    type: 'vbox',
                    animate: true
                },
                documentType: "Person",
                dataRoots: [
                    "Child"
                ],
                border: false,
                title: Lumen.i18n("Parent and Child Information"),
                saveableDocument: true,
                defaults: {
                    autoHeight: true,
                    xtype: "appformloader",
                    border: false,
                    width: "100%"
                },
                items: [
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Student Information"),
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ChildInformation.js"
                    },
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Parent Information"),
                        name: "Child",
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/ParentInformation.js"
                    }
                ]
            },
            {
                xtype: "panel",
                title: Lumen.i18n("Health Statements"),
                saveableDocument: true,
                name: "HealthStatements",
                buttonText: "Save",
                introUrl: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/no.html",
                defaults: {
                    autoHeight: true,
                    xtype: "appformloader",
                    padding: 4,
                    border: false
                },
                items: [
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Hearing and Seeing"),
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/HearingSeeing.js"
                    },
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Health Statement"),
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/HealthStatement.js"
                    }
                ]
            },
            {
                xtype: "panel",
                layout: {
                    // layout-specific configs go here
                    type: 'vbox',
                    animate: true
                },
                title: Lumen.i18n("Consent Forms"),
                saveableDocument: true,
                name: "ConsentForms",
                buttonText: "Save Consent Form",
                introUrl: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/no.html",
                defaults: {
                    autoHeight: true,
                    xtype: "appformloader",
                    border: false
                },
                items: [
                    {
                        insertIndex: 350,
                        title: Lumen.i18n("Parental Consent"),
                        width: "100%",
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/ParentalConsent.js"
                    },
                    {
                        insertIndex: 350,
                        width: "100%",
                        title: Lumen.i18n("New Students Record Release"),
                        completeSection: "necessary_for_completeness_verification",
                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/RecordsRelease.js"
                    }
                    //                    {
                    //                        insertIndex: 350,
                    //                        title: Lumen.i18n("Internet Consent"),
                    //                        completeSection: "necessary_for_completeness_verification",
                    //                        defaults: {
                    //                            cls: 'formContentWrapper'
                    //                        },
                    //                        modelToLoad: {},
                    //                        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/InternetConsent.js"
                    //                    }
                ]
            },
            {
                xtype: "paymentplan",
                rolePermissions: {
                    admin: "write",
                    unauthorizedAction: "destroy"
                },
                title: Lumen.i18n("Tuition and Fees"),
                completeSection: "necessary_for_completeness_verification",
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/TuitionPaymentForm.js"
            },
            {
                insertIndex: 300,
                title: Lumen.i18n("Enrollment Contract"),
                itemId: "enrollmentContract",
                saveableDocument: true,
                name: "EnrollmentContract",
                buttonText: "Submit Contract",
                completeSection: "necessary_for_completeness_verification",
                defaults: {
                    cls: 'formContentWrapper'
                },
                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/EnrollmentContract.js"
            }
        ]
    }
]
