[
    {
        xtype: "container",
        itemId: 'evaluation',
        layout: {
            type: "table",
            columns: 2
        },
        defaults: {
            xtype: "textfield"
        },
        items: [
            {collapsed: false, name: "TeachersNameandPosition", allowBlank: false, fieldLabel: Lumen.I18N_PROMPTS.TeachersNameandPosition, readOnly: this.readOnly},
            {collapsed: false, name: "ApplicantsCurrentGradeLevel", fieldLabel: Lumen.I18N_PROMPTS.ApplicantsCurrentGradeLevel, readOnly: this.readOnly},
            {collapsed: false, name: "NameofSchool", allowBlank: false, fieldLabel: Lumen.I18N_PROMPTS.NameofSchool, readOnly: this.readOnly},
            {collapsed: false, name: "CityStateWhereSchoolisLocated", allowBlank: false, fieldLabel: Lumen.I18N_PROMPTS.CityStateWhereSchoolisLocated, readOnly: this.readOnly},
            {collapsed: false, name: "Howlonghaveyouknownthisstudentandinwhatcapacity", allowBlank: false, fieldLabel: Lumen.I18N_PROMPTS.Howlonghaveyouknownthisstudentandinwhatcapacity, readOnly: this.readOnly}
        ]
    },
    {
        xtype: "container",
        align: "stretch",
        flex: 1,
        width: "100%",
        defaults: {
            align: "stretch",
            layout: "fit",
            flex: 2,
            padding: 0,
            border: 0
        },
        items: [
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Whatarethefirstthreewordsthatcometomindwhendescribingthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Whatarethefirstthreewordsthatcometomindwhendescribingthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasecommentonnoteworthyacedemicstrengthsandchallengesofthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Pleasecommentonnoteworthyacedemicstrengthsandchallengesofthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasecommentonsocialacedemicstrengthsandchallengesofthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Pleasecommentonsocialacedemicstrengthsandchallengesofthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Anythingelseyouwouldliketoshare", fieldLabel: Lumen.I18N_PROMPTS.Anythingelseyouwouldliketoshare, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasedescribethechildssocialemotionalconstitution", fieldLabel: Lumen.I18N_PROMPTS.Pleasedescribethechildssocialemotionalconstitution, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleaseshareyourthoughtsonthisapplicantsfamilyincludingthefamilysinvolvementrelationshipwiththeschool", fieldLabel: Lumen.I18N_PROMPTS.Pleaseshareyourthoughtsonthisapplicantsfamilyincludingthefamilysinvolvementrelationshipwiththeschool, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "ToyourknowledgeistheparentsperceptionoftheirchildcompatiblewiththeschoolsunderstandingofthechildPleaseelaborate", fieldLabel: Lumen.I18N_PROMPTS.ToyourknowledgeistheparentsperceptionoftheirchildcompatiblewiththeschoolsunderstandingofthechildPleaseelaborate, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleaseusethreewordstodescribetheparentsinregardtotheirchild", fieldLabel: Lumen.I18N_PROMPTS.Pleaseusethreewordstodescribetheparentsinregardtotheirchild, readOnly: this.readOnly},
            {xtype: "textareafieldset", allowBlank: false, collapsible: false, border: false, align: "stretch", collapsed: false, name: "Areyouawareofanyfamilycircumstancethataffectthechildslifeatschool", fieldLabel: Lumen.I18N_PROMPTS.Areyouawareofanyfamilycircumstancethataffectthechildslifeatschool, readOnly: this.readOnly},
            {
                xtype: "textareafieldset",
                collapsible: false,
                border: false,
                align: "stretch",
                collapsed: false,
                name: "Pleaseusethespacebelowtoaddadditionalcomments",
                fieldLabel: Lumen.I18N_PROMPTS.Pleaseusethespacebelowtoaddadditionalcomments,
                readOnly: this.readOnly
            }
        ]
    },
    {
        xtype: "component",
        cls: "sectionInstructions",
        html: Lumen.I18N_PROMPTS.Pleaseevaluatethestudentonthefollowingattributes
    },
    {
        xtype: "container",
        cls: "surveyQuestionGrid",
        showCellLabels: true,
        defaults: {
            xtype: "bindableradiogroup",
            items: [
                {name: "Assessment", inputValue: "Exceptional", boxLabel: "Exceptional"},
                {name: "Assessment", inputValue: "Above Average", boxLabel: "Above Average"},
                {name: "Assessment", inputValue: "Average", boxLabel: "Average"},
                {name: "Assessment", inputValue: "Below Average", boxLabel: "Below Average"}
            ]
        },
        items: [
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Academicachievement,
                name: "Academicachievement",
                allowBlank: false,
                items: [
                    {name: "belowexpectations",inputValue: "belowexpectations",boxLabel: Lumen.I18N_PROMPTS.belowexpectations, readOnly: this.readOnly},
                    {name: "betterthantests", inputValue: "betterthantests",boxLabel: Lumen.I18N_PROMPTS.betterthantests, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "outstanding", inputValue: "outstanding",boxLabel: Lumen.I18N_PROMPTS.outstanding, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytoworkingroups,
                name: "Abilitytoworkingroups",
                allowBlank: false,
                items: [
                    {name: "hasgreatdifficulty", inputValue: "hasgreatdifficulty",boxLabel: Lumen.I18N_PROMPTS.hasgreatdifficulty, readOnly: this.readOnly},
                    {name: "sometimeshasdifficulty", inputValue: "sometimeshasdifficulty",boxLabel: Lumen.I18N_PROMPTS.sometimeshasdifficulty, readOnly: this.readOnly},
                    {name: "usuallyeffective", inputValue: "usuallyeffective",boxLabel: Lumen.I18N_PROMPTS.usuallyeffective, readOnly: this.readOnly},
                    {name: "alwaysworkswell", inputValue: "alwaysworkswell",boxLabel: Lumen.I18N_PROMPTS.alwaysworkswell, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Participatesindiscussion,
                name: "Participatesindiscussion",
                allowBlank: false,
                items: [
                    {name: "rarelycontributes", inputValue: "rarelycontributes",boxLabel: Lumen.I18N_PROMPTS.rarelycontributes, readOnly: this.readOnly},
                    {name: "wantstodominate", inputValue: "wantstodominate",boxLabel: Lumen.I18N_PROMPTS.wantstodominate, readOnly: this.readOnly},
                    {name: "contributesoccasionally", inputValue: "contributesoccasionally",boxLabel: Lumen.I18N_PROMPTS.contributesoccasionally, readOnly: this.readOnly},
                    {name: "joinsinreadily", inputValue: "joinsinreadily",boxLabel: Lumen.I18N_PROMPTS.joinsinreadily, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Classroomconduct,
                name: "Classroomconduct",
                allowBlank: false,
                items: [
                    {name: "frequentdisruptions", inputValue: "frequentdisruptions",boxLabel: Lumen.I18N_PROMPTS.frequentdisruptions, readOnly: this.readOnly},
                    {name: "occasionalmisconduct", inputValue: "occasionalmisconduct",boxLabel: Lumen.I18N_PROMPTS.occasionalmisconduct, readOnly: this.readOnly},
                    {name: "usuallygoodbehavior", inputValue: "usuallygoodbehavior",boxLabel: Lumen.I18N_PROMPTS.usuallygoodbehavior, readOnly: this.readOnly},
                    {name: "goodconduct", inputValue: "goodconduct",boxLabel: Lumen.I18N_PROMPTS.goodconduct, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Writtenexpression,
                name: "Writtenexpression",
                allowBlank: false,
                items: [
                    {name: "poor", inputValue: "poor",boxLabel: Lumen.I18N_PROMPTS.poor, readOnly: this.readOnly},
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "excellent", inputValue: "excellent",boxLabel: Lumen.I18N_PROMPTS.excellent, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytoworkalone,
                name: "Abilitytoworkalone",
                allowBlank: false,
                items: [
                    {name: "hasgreatdifficulty", inputValue: "hasgreatdifficulty",boxLabel: Lumen.I18N_PROMPTS.hasgreatdifficulty, readOnly: this.readOnly},
                    {name: "needshelp", inputValue: "needshelp",boxLabel: Lumen.I18N_PROMPTS.needshelp, readOnly: this.readOnly},
                    {name: "needshelpoccasionally", inputValue: "needshelpoccasionally",boxLabel: Lumen.I18N_PROMPTS.needshelpoccasionally, readOnly: this.readOnly},
                    {name: "alwaysworkswell", inputValue: "alwaysworkswell",boxLabel: Lumen.I18N_PROMPTS.alwaysworkswell, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytoexpressideasorally,
                name: "Abilitytoexpressideasorally",
                allowBlank: false,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "hassomedifficulty", inputValue: "hassomedifficulty",boxLabel: Lumen.I18N_PROMPTS.hassomedifficulty, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "exceptional", inputValue: "exceptional",boxLabel: Lumen.I18N_PROMPTS.exceptional, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Dailypreparation,
                name: "Dailypreparation",
                allowBlank: false,
                items: [
                    {name: "poor", inputValue: "poor",boxLabel: Lumen.I18N_PROMPTS.poor, readOnly: this.readOnly},
                    {name: "fair", inputValue: "fair",boxLabel: Lumen.I18N_PROMPTS.fair, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "excellent", inputValue: "excellent",boxLabel: Lumen.I18N_PROMPTS.excellent, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Useoftime,
                name: "Useoftime",
                allowBlank: false,
                items: [
                    {name: "needsassistancemanaging", inputValue: "needsassistancemanaging",boxLabel: Lumen.I18N_PROMPTS.needsassistancemanaging, readOnly: this.readOnly},
                    {name: "occasionallyuseswell", inputValue: "occasionallyuseswell",boxLabel: Lumen.I18N_PROMPTS.occasionallyuseswell, readOnly: this.readOnly},
                    {name: "usuallyuseswell", inputValue: "usuallyuseswell",boxLabel: Lumen.I18N_PROMPTS.usuallyuseswell, readOnly: this.readOnly},
                    {name: "alwaysuseseffectively", inputValue: "alwaysuseseffectively",boxLabel: Lumen.I18N_PROMPTS.alwaysuseseffectively, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Followsdirections,
                name: "Followsdirections",
                allowBlank: false,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "needsmuchexplanation", inputValue: "needsmuchexplanation",boxLabel: Lumen.I18N_PROMPTS.needsmuchexplanation, readOnly: this.readOnly},
                    {name: "occasionallyneedshelp", inputValue: "occasionallyneedshelp",boxLabel: Lumen.I18N_PROMPTS.occasionallyneedshelp, readOnly: this.readOnly},
                    {name: "quicklyandeffectively", inputValue: "quicklyandeffectively",boxLabel: Lumen.I18N_PROMPTS.quicklyandeffectively, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Criticalthinking,
                name: "Criticalthinking",
                allowBlank: false,
                items: [
                    {name: "rarely", inputValue: "rarely",boxLabel: Lumen.I18N_PROMPTS.rarely, readOnly: this.readOnly},
                    {name: "fair", inputValue: "fair",boxLabel: Lumen.I18N_PROMPTS.fair, readOnly: this.readOnly},
                    {name: "frequentlyperceptive", inputValue: "frequentlyperceptive",boxLabel: Lumen.I18N_PROMPTS.frequentlyperceptive, readOnly: this.readOnly},
                    {name: "exceptionallyperceptive", inputValue: "exceptionallyperceptive",boxLabel: Lumen.I18N_PROMPTS.exceptionallyperceptive, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Seekshelpwhenneeded,
                name: "Seekshelpwhenneeded",
                allowBlank: false,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "usually", inputValue: "usually",boxLabel: Lumen.I18N_PROMPTS.usually, readOnly: this.readOnly},
                    {name: "always", inputValue: "always",boxLabel: Lumen.I18N_PROMPTS.always, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Effortdrive,
                name: "Effortdrive",
                allowBlank: false,
                items: [
                    {name: "easilydistracted", inputValue: "easilydistracted",boxLabel: Lumen.I18N_PROMPTS.easilydistracted, readOnly: this.readOnly},
                    {name: "sporadic", inputValue: "sporadic",boxLabel: Lumen.I18N_PROMPTS.sporadic, readOnly: this.readOnly},
                    {name: "usuallygood", inputValue: "usuallygood",boxLabel: Lumen.I18N_PROMPTS.usuallygood, readOnly: this.readOnly},
                    {name: "exceptionallygood", inputValue: "exceptionallygood",boxLabel: Lumen.I18N_PROMPTS.exceptionallygood, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Attentionspan,
                name: "Attentionspan",
                allowBlank: false,
                items: [
                    {name: "frequentlydistracted", inputValue: "frequentlydistracted",boxLabel: Lumen.I18N_PROMPTS.frequentlydistracted, readOnly: this.readOnly},
                    {name: "occasionallydistracted", inputValue: "occasionallydistracted",boxLabel: Lumen.I18N_PROMPTS.occasionallydistracted, readOnly: this.readOnly},
                    {name: "usuallygood", inputValue: "usuallygood",boxLabel: Lumen.I18N_PROMPTS.usuallygood, readOnly: this.readOnly},
                    {name: "exceptionallygood", inputValue: "exceptionallygood",boxLabel: Lumen.I18N_PROMPTS.exceptionallygood, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Leadershippotential,
                name: "Leadershippotential",
                allowBlank: false,
                items: [
                    {name: "neverinitiates", inputValue: "neverinitiates",boxLabel: Lumen.I18N_PROMPTS.neverinitiates, readOnly: this.readOnly},
                    {name: "leadswhengivenresponsibility", inputValue: "leadswhengivenresponsibility",boxLabel: Lumen.I18N_PROMPTS.leadswhengivenresponsibility, readOnly: this.readOnly},
                    {name: "seekopportunitiesandusesthemwell", inputValue: "seekopportunitiesandusesthemwell",boxLabel: Lumen.I18N_PROMPTS.seekopportunitiesandusesthemwell, readOnly: this.readOnly},
                    {name: "anaturalleader", inputValue: "anaturalleader",boxLabel: Lumen.I18N_PROMPTS.anaturalleader, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Observesrulesandacceptsschoolprocedures,
                name: "Observesrulesandacceptsschoolprocedures",
                allowBlank: false,
                items: [
                    {name: "rarely", inputValue: "rarely",boxLabel: Lumen.I18N_PROMPTS.rarely, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "usually", inputValue: "usually",boxLabel: Lumen.I18N_PROMPTS.usually, readOnly: this.readOnly},
                    {name: "always", inputValue: "always",boxLabel: Lumen.I18N_PROMPTS.always, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Initiative,
                name: "Initiative",
                allowBlank: false,
                items: [
                    {name: "easilydistracted", inputValue: "easilydistracted",boxLabel: Lumen.I18N_PROMPTS.easilydistracted, readOnly: this.readOnly},
                    {name: "rarelyshowsinitiative", inputValue: "rarelyshowsinitiative",boxLabel: Lumen.I18N_PROMPTS.rarelyshowsinitiative, readOnly: this.readOnly},
                    {name: "occasionallyinitiates", inputValue: "occasionallyinitiates",boxLabel: Lumen.I18N_PROMPTS.occasionallyinitiates, readOnly: this.readOnly},
                    {name: "ofteninitiates", inputValue: "ofteninitiates",boxLabel: Lumen.I18N_PROMPTS.ofteninitiates, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Curiosity,
                name: "Curiosity",
                allowBlank: false,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "frequent", inputValue: "frequent",boxLabel: Lumen.I18N_PROMPTS.frequent, readOnly: this.readOnly},
                    {name: "consistent", inputValue: "consistent",boxLabel: Lumen.I18N_PROMPTS.consistent, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Imagination,
                name: "Imagination",
                allowBlank: false,
                items: [
                    {name: "little", inputValue: "little",boxLabel: Lumen.I18N_PROMPTS.little, readOnly: this.readOnly},
                    {name: "fair", inputValue: "fair",boxLabel: Lumen.I18N_PROMPTS.fair, readOnly: this.readOnly},
                    {name: "active", inputValue: "active",boxLabel: Lumen.I18N_PROMPTS.active, readOnly: this.readOnly},
                    {name: "highlydeveloped", inputValue: "highlydeveloped",boxLabel: Lumen.I18N_PROMPTS.highlydeveloped, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Integrity,
                name: "Integrity",
                allowBlank: false,
                items: [
                    {name: "questionable", inputValue: "questionable",boxLabel: Lumen.I18N_PROMPTS.questionable, readOnly: this.readOnly},
                    {name: "usuallytrustworthy", inputValue: "usuallytrustworthy",boxLabel: Lumen.I18N_PROMPTS.usuallytrustworthy, readOnly: this.readOnly},
                    {name: "trustworthy", inputValue: "trustworthy",boxLabel: Lumen.I18N_PROMPTS.trustworthy, readOnly: this.readOnly},
                    {name: "highlydeveloped", inputValue: "highlydeveloped",boxLabel: Lumen.I18N_PROMPTS.highlydeveloped, readOnly: this.readOnly}
                ]
            },
            {
                collapsed: false,
                fieldLabel: Lumen.I18N_PROMPTS.Considerationofothers,
                name: "Considerationofothers",
                allowBlank: false,
                items: [
                    {name: "rarelyconsiderate", inputValue: "rarelyconsiderate",boxLabel: Lumen.I18N_PROMPTS.rarelyconsiderate, readOnly: this.readOnly},
                    {name: "sometimesconsiderate", inputValue: "sometimesconsiderate",boxLabel: Lumen.I18N_PROMPTS.sometimesconsiderate, readOnly: this.readOnly},
                    {name: "usuallyconsiderate", inputValue: "usuallyconsiderate",boxLabel: Lumen.I18N_PROMPTS.usuallyconsiderate, readOnly: this.readOnly},
                    {name: "alwaysthoughtful", inputValue: "alwaysthoughtful",boxLabel: Lumen.I18N_PROMPTS.alwaysthoughtful, readOnly: this.readOnly}
                ]
            }
        ]
    },
    {
        xtype: "container",
        align: "stretch",
        flex: 1,
        defaults: {
            align: "stretch",
            layout: "fit",
            xtype: "textfield",
            flex: 1,
            padding: 0,
            border: 0
        },
        items: [
            {
                xtype: "bindableradiogroup",
                collapsible: false,
                collapsed: false,
                columns: 2,
                flex: 8,
                align: "stretch",
                border: false,
                labelCls: "surveyRadioGroupLabel",
                allowBlank: false,
                name: "Ifwehavefurtherquestionsdowehavepermissiontocontactyou",
                fieldLabel: Lumen.I18N_PROMPTS.Ifwehavefurtherquestionsdowehavepermissiontocontactyou,
                items: [
                    {
                        boxLabel: Lumen.I18N_PROMPTS.yes,
                        name: "Ifwehavefurtherquestionsdowehavepermissiontocontactyou",
                        inputValue: Lumen.I18N_PROMPTS.yes
                    },
                    {
                        boxLabel: Lumen.I18N_PROMPTS.no,
                        name: "Ifwehavefurtherquestionsdowehavepermissiontocontactyou",
                        inputValue: Lumen.I18N_PROMPTS.no}
                ]},
            {fieldLabel: Lumen.I18N_PROMPTS.Ifyesphonenumberoremail, name: "Ifyesphonenumberoremail", readOnly: this.readOnly},
            {fieldLabel: Lumen.I18N_PROMPTS.Besttimetocall, name: "Besttimetocall", readOnly: this.readOnly}
        ]
    }
]


