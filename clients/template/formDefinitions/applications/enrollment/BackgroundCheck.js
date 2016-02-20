[
    {
        html: "<div class='instructions formContent'>In order to keep a safe and wholesome environment for your child we require all parents and volunteers to submit to a background check.<div class='formContentSection'>" +
            "I hereby give my permission for Integrity Academy to obtain information relating to my criminal history record. The criminal history " +
            "record as received from the reporting agency may include arrest and conviction data as well as plea bargains and deferred " +
            "adjudications and delinquent conduct committed as a juvenile. I understand that this information will be used, in part, to determine " +
            "my eligibility for an employment/volunteer position with this organization. I also understand that as long as I remain an employee or " +
            "volunteer here, the criminal history records check may be repeated at any time. I understand that I will have the right to review the " +
            "criminal history as received by Integrity Academy, if I request it, and a procedure is available for clarification if I dispute the record " +
            "as received.</div>" +
            "<div class='formContentSection'>By entering my full name and date of birth below, I, do, for myself, my heirs, executors, and " +
            "administrators, hereby remise, release, and forever discharge and agree to indemnify Integrity Academy and each of its officers " +
            "directors, employees, and agents and hold them harmless from and against any and all causes of actions, suits, liabilities, costs, " +
            "debts, and sums of money, claims, and demands whatsoever, and any and all related attorneys' fees, court costs, and other " +
            "expenses resulting from the investigation of my background in connection with my application to become a volunteer/staff " +
            "member.</div>" +
            "</div><hr/>",
        contentIsValue: true,
        border: false,
        name: "Agreement"
    },
    {
        xtype: "container",
        populateFormFromData: true,
        defaults: {
            xtype: "textareafieldset",
            padding: 0,
            border: 0
        },
        items: [
            {
                xtype: "container",
                layout: {
                    type: 'table',
                    columns: 2,
                    tableAttrs: {
                        cls: 'formContentTable'
                    }
                },
                items: [
                    {
                        xtype: "textfield",
                        fieldLabel: "Full Name",
                        allowBlank: false,
                        name: "FullName"
                    },
                    {
                        xtype: "textfield",
                        name: "MaidenOrOtherName",
                        fieldLabel: "Maiden and/or Other Names Used",
                        allowBlank: false,
                        name: "OtherName"
                    },
                    {
                        xtype: "textfield",
                        name: "SocialSecurityNumber",
                        fieldLabel: "Social Security #",
                        allowBlank: false,
                        name: "SSN"
                    },
                    {
                        xtype: "datefield",
                        labelAlign: "left",
                        name: "DateOfBirth",
                        fieldLabel: "Date of Birth",
                        required: true,
                        border: false,
                        collapsible: false
                    }
                ]
            },
            {
                xtype: "component",
                html: "<hr/><div class='instructions formContent'>"+ Lumen.i18n('moralTurpitudeInstruction')+"</div>" +
                    "</div>",
                border: false
            },
            {
                xtype: "textareafieldset",
                title: Lumen.i18n("felonyConvictionQuestion"),
                allowBlank: true,
                name: "FelonyConvictionQuestion"
            },
            {
                xtype: "textareafieldset",
                title: Lumen.i18n("courtPleaQuestion"),
                allowBlank: true,
                name: "CourtPleaQuestion"
            },
            {
                xtype: "component",
                html: "<div class='instructions formContent'>" + Lumen.i18n("employmentSeekingInstruction") + "</div>" +
                    "</div>",
                border: false
            },
            {
                xtype: "textareafieldset",
                title: Lumen.i18n("beenFiredQuestion"),
                allowBlank: false,
                name: "DischargeQuestion"
            }
        ]
    }
]