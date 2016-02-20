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
            {collapsed: false, name: "TeachersNameandPosition", fieldLabel: Lumen.I18N_PROMPTS.TeachersNameandPosition, readOnly: this.readOnly},
            {collapsed: false, name: "ApplicantsCurrentGradeLevel", fieldLabel: Lumen.I18N_PROMPTS.ApplicantsCurrentGradeLevel, readOnly: this.readOnly},
            {collapsed: false, name: "NameofSchool", fieldLabel: Lumen.I18N_PROMPTS.NameofSchool, readOnly: this.readOnly},
            {collapsed: false, name: "CityStateWhereSchoolisLocated", fieldLabel: Lumen.I18N_PROMPTS.CityStateWhereSchoolisLocated, readOnly: this.readOnly},
            {collapsed: false, name: "Howlonghaveyouknownthisstudentandinwhatcapacity", fieldLabel: Lumen.I18N_PROMPTS.Howlonghaveyouknownthisstudentandinwhatcapacity, readOnly: this.readOnly}
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
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Whatarethefirstthreewordsthatcometomindwhendescribingthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Whatarethefirstthreewordsthatcometomindwhendescribingthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasecommentonnoteworthyacedemicstrengthsandchallengesofthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Pleasecommentonnoteworthyacedemicstrengthsandchallengesofthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasecommentonsocialacedemicstrengthsandchallengesofthisstudent", fieldLabel: Lumen.I18N_PROMPTS.Pleasecommentonsocialacedemicstrengthsandchallengesofthisstudent, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Anythingelseyouwouldliketoshare", fieldLabel: Lumen.I18N_PROMPTS.Anythingelseyouwouldliketoshare, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleasedescribethechildssocialemotionalconstitution", fieldLabel: Lumen.I18N_PROMPTS.Pleasedescribethechildssocialemotionalconstitution, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleaseshareyourthoughtsonthisapplicantsfamilyincludingthefamilysinvolvementrelationshipwiththeschool", fieldLabel: Lumen.I18N_PROMPTS.Pleaseshareyourthoughtsonthisapplicantsfamilyincludingthefamilysinvolvementrelationshipwiththeschool, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "ToyourknowledgeistheparentsperceptionoftheirchildcompatiblewiththeschoolsunderstandingofthechildPleaseelaborate", fieldLabel: Lumen.I18N_PROMPTS.ToyourknowledgeistheparentsperceptionoftheirchildcompatiblewiththeschoolsunderstandingofthechildPleaseelaborate, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Pleaseusethreewordstodescribetheparentsinregardtotheirchild", fieldLabel: Lumen.I18N_PROMPTS.Pleaseusethreewordstodescribetheparentsinregardtotheirchild, readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, name: "Areyouawareofanyfamilycircumstancethataffectthechildslifeatschool", fieldLabel: Lumen.I18N_PROMPTS.Areyouawareofanyfamilycircumstancethataffectthechildslifeatschool, readOnly: this.readOnly}
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
            ]
        },
        items: [
            {
                name: "Abilitytoworkingroups",
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytoworkingroups,
                items: [
                    {name: "hasgreatdifficulty", inputValue: "hasgreatdifficulty",boxLabel: Lumen.I18N_PROMPTS.hasgreatdifficulty, readOnly: this.readOnly},
                    {name: "sometimeshasdifficulty", inputValue: "sometimeshasdifficulty",boxLabel: Lumen.I18N_PROMPTS.sometimeshasdifficulty, readOnly: this.readOnly},
                    {name: "usuallyeffective", inputValue: "usuallyeffective",boxLabel: Lumen.I18N_PROMPTS.usuallyeffective, readOnly: this.readOnly},
                    {name: "alwaysworkswell", inputValue: "alwaysworkswell",boxLabel: Lumen.I18N_PROMPTS.alwaysworkswell, readOnly: this.readOnly}
                ]
            },
            {
                name: "Toiletlearning",
                fieldLabel: Lumen.I18N_PROMPTS.Toiletlearning,
                items: [
                    {name: "withassistance", inputValue: "withassistance",boxLabel: Lumen.I18N_PROMPTS.withassistance, readOnly: this.readOnly},
                    {name: "twoormoreaccidentsaday", inputValue: "twoormoreaccidentsaday",boxLabel: Lumen.I18N_PROMPTS.twoormoreaccidentsaday, readOnly: this.readOnly},
                    {name: "needsreminders", inputValue: "needsreminders",boxLabel: Lumen.I18N_PROMPTS.needsreminders, readOnly: this.readOnly},
                    {name: "takescareofneedsalone", inputValue: "takescareofneedsalone",boxLabel: Lumen.I18N_PROMPTS.takescareofneedsalone, readOnly: this.readOnly}
                ]
            },
            {
                name: "Abilitytocompletetasksindependently",
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytocompletetasksindependently,
                items: [
                    {name: "hasgreatdifficulty", inputValue: "hasgreatdifficulty",boxLabel: Lumen.I18N_PROMPTS.hasgreatdifficulty, readOnly: this.readOnly},
                    {name: "needshelp", inputValue: "needshelp",boxLabel: Lumen.I18N_PROMPTS.needshelp, readOnly: this.readOnly},
                    {name: "needshelpoccasionally ", inputValue: "needshelpoccasionally ",boxLabel: Lumen.I18N_PROMPTS.needshelpoccasionally , readOnly: this.readOnly},
                    {name: "alwaysworkswell", inputValue: "alwaysworkswell",boxLabel: Lumen.I18N_PROMPTS.alwaysworkswell, readOnly: this.readOnly}
                ]
            },
            {
                name: "Abilitytoexpressneedsverbally",
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytoexpressneedsverbally,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "hassomedifficulty", inputValue: "hassomedifficulty",boxLabel: Lumen.I18N_PROMPTS.hassomedifficulty, readOnly: this.readOnly},
                    {name: "good ", inputValue: "good ",boxLabel: Lumen.I18N_PROMPTS.good , readOnly: this.readOnly},
                    {name: "exceptional", inputValue: "exceptional",boxLabel: Lumen.I18N_PROMPTS.exceptional, readOnly: this.readOnly}
                ]
            },
            {
                name: "Followsverbaldirections",
                fieldLabel: Lumen.I18N_PROMPTS.Followsverbaldirections,
                items: [
                    {name: "limited ", inputValue: "limited ",boxLabel: Lumen.I18N_PROMPTS.limited , readOnly: this.readOnly},
                    {name: "needsmuchexplanation", inputValue: "needsmuchexplanation",boxLabel: Lumen.I18N_PROMPTS.needsmuchexplanation, readOnly: this.readOnly},
                    {name: "occasionallyneedshelp", inputValue: "occasionallyneedshelp",boxLabel: Lumen.I18N_PROMPTS.occasionallyneedshelp, readOnly: this.readOnly},
                    {name: "highlydeveloped", inputValue: "highlydeveloped",boxLabel: Lumen.I18N_PROMPTS.highlydeveloped, readOnly: this.readOnly}
                ]
            },
            {
                name: "Seekshelpfromanadultwhenneeded",
                fieldLabel: Lumen.I18N_PROMPTS.Seekshelpfromanadultwhenneeded,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "usually", inputValue: "usually",boxLabel: Lumen.I18N_PROMPTS.usually, readOnly: this.readOnly},
                    {name: "always", inputValue: "always",boxLabel: Lumen.I18N_PROMPTS.always, readOnly: this.readOnly}
                ]
            },
            {
                name: "Abidesbyguidelines",
                fieldLabel: Lumen.I18N_PROMPTS.Abidesbyguidelines,
                items: [
                    {name: "rarely", inputValue: "rarely",boxLabel: Lumen.I18N_PROMPTS.rarely, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "usually", inputValue: "usually",boxLabel: Lumen.I18N_PROMPTS.usually, readOnly: this.readOnly},
                    {name: "always", inputValue: "always",boxLabel: Lumen.I18N_PROMPTS.always, readOnly: this.readOnly}
                ]
            },
            {
                name: "Abilitytotransition",
                fieldLabel: Lumen.I18N_PROMPTS.Abilitytotransition,
                items: [
                    {name: "hasgreatdifficulty", inputValue: "hasgreatdifficulty",boxLabel: Lumen.I18N_PROMPTS.hasgreatdifficulty, readOnly: this.readOnly},
                    {name: "needshelp", inputValue: "needshelp",boxLabel: Lumen.I18N_PROMPTS.needshelp, readOnly: this.readOnly},
                    {name: "needshelpoccasionally", inputValue: "needshelpoccasionally",boxLabel: Lumen.I18N_PROMPTS.needshelpoccasionally, readOnly: this.readOnly},
                    {name: "alwaystransitionswell", inputValue: "alwaystransitionswell",boxLabel: Lumen.I18N_PROMPTS.alwaystransitionswell, readOnly: this.readOnly}
                ]
            },
            {
                name: "Curiosity",
                fieldLabel: Lumen.I18N_PROMPTS.Curiosity,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "frequent", inputValue: "frequent",boxLabel: Lumen.I18N_PROMPTS.frequent, readOnly: this.readOnly},
                    {name: "consistent", inputValue: "consistent",boxLabel: Lumen.I18N_PROMPTS.consistent, readOnly: this.readOnly}
                ]
            },
            {
                name: "Considerationofothers",
                fieldLabel: Lumen.I18N_PROMPTS.Considerationofothers,
                items: [
                    {name: "rarelyconsiderate", inputValue: "rarelyconsiderate",boxLabel: Lumen.I18N_PROMPTS.rarelyconsiderate, readOnly: this.readOnly},
                    {name: "sometimesconsiderate", inputValue: "sometimesconsiderate",boxLabel: Lumen.I18N_PROMPTS.sometimesconsiderate, readOnly: this.readOnly},
                    {name: "usuallyconsiderate", inputValue: "usuallyconsiderate",boxLabel: Lumen.I18N_PROMPTS.usuallyconsiderate, readOnly: this.readOnly},
                    {name: "alwaysthoughtful", inputValue: "alwaysthoughtful",boxLabel: Lumen.I18N_PROMPTS.alwaysthoughtful, readOnly: this.readOnly}
                ]
            },
            {
                name: "Getsalongwellwithpeers",
                fieldLabel: Lumen.I18N_PROMPTS.Getsalongwellwithpeers,
                items: [
                    {name: "rarely", inputValue: "rarely",boxLabel: Lumen.I18N_PROMPTS.rarely, readOnly: this.readOnly},
                    {name: "occasionally", inputValue: "occasionally",boxLabel: Lumen.I18N_PROMPTS.occasionally, readOnly: this.readOnly},
                    {name: "usually", inputValue: "usually",boxLabel: Lumen.I18N_PROMPTS.usually, readOnly: this.readOnly},
                    {name: "always", inputValue: "always",boxLabel: Lumen.I18N_PROMPTS.always, readOnly: this.readOnly}
                ]
            },
            {
                name: "Socialadjustmentwithpeers",
                fieldLabel: Lumen.I18N_PROMPTS.Socialadjustmentwithpeers,
                items: [
                    {name: "relatespoorly", inputValue: "relatespoorly",boxLabel: Lumen.I18N_PROMPTS.relatespoorly, readOnly: this.readOnly},
                    {name: "hasoccasionalproblems", inputValue: "hasoccasionalproblems",boxLabel: Lumen.I18N_PROMPTS.hasoccasionalproblems, readOnly: this.readOnly},
                    {name: "usuallyrelateswell", inputValue: "usuallyrelateswell",boxLabel: Lumen.I18N_PROMPTS.usuallyrelateswell, readOnly: this.readOnly},
                    {name: "healthyrelationships", inputValue: "healthyrelationships",boxLabel: Lumen.I18N_PROMPTS.healthyrelationships, readOnly: this.readOnly}
                ]
            },
            {
                name: "Bodyawareness",
                fieldLabel: Lumen.I18N_PROMPTS.Bodyawareness,
                items: [
                    {name: "limited", inputValue: "limited",boxLabel: Lumen.I18N_PROMPTS.limited, readOnly: this.readOnly},
                    {name: "fair", inputValue: "fair",boxLabel: Lumen.I18N_PROMPTS.fair, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "highlydeveloped", inputValue: "highlydeveloped",boxLabel: Lumen.I18N_PROMPTS.highlydeveloped, readOnly: this.readOnly}
                ]
            },
            {
                name: "Parentparticipation",
                fieldLabel: Lumen.I18N_PROMPTS.Parentparticipation,
                items: [
                    {name: "rarelyinvolved", inputValue: "rarelyinvolved",boxLabel: Lumen.I18N_PROMPTS.rarelyinvolved, readOnly: this.readOnly},
                    {name: "overlyinvolved", inputValue: "overlyinvolved",boxLabel: Lumen.I18N_PROMPTS.overlyinvolved, readOnly: this.readOnly},
                    {name: "sometimesinvolved", inputValue: "sometimesinvolved",boxLabel: Lumen.I18N_PROMPTS.sometimesinvolved, readOnly: this.readOnly},
                    {name: "appropriatelyinvolved", inputValue: "appropriatelyinvolved",boxLabel: Lumen.I18N_PROMPTS.appropriatelyinvolved, readOnly: this.readOnly}
                ]
            },
            {
                name: "Parentcooperation",
                fieldLabel: Lumen.I18N_PROMPTS.Parentcooperation,
                items: [
                    {name: "unknown", inputValue: "unknown",boxLabel: Lumen.I18N_PROMPTS.unknown, readOnly: this.readOnly},
                    {name: "fair", inputValue: "fair",boxLabel: Lumen.I18N_PROMPTS.fair, readOnly: this.readOnly},
                    {name: "good", inputValue: "good",boxLabel: Lumen.I18N_PROMPTS.good, readOnly: this.readOnly},
                    {name: "outstanding", inputValue: "outstanding",boxLabel: Lumen.I18N_PROMPTS.outstanding, readOnly: this.readOnly}
                ]
            },
            {
                name: "Parentexpectations",
                fieldLabel: Lumen.I18N_PROMPTS.Parentexpectations,
                items: [
                    {name: "unknown", inputValue: "unknown",boxLabel: Lumen.I18N_PROMPTS.unknown, readOnly: this.readOnly},
                    {name: "unrealistic", inputValue: "unrealistic",boxLabel: Lumen.I18N_PROMPTS.unrealistic, readOnly: this.readOnly},
                    {name: "realistic", inputValue: "realistic",boxLabel: Lumen.I18N_PROMPTS.realistic, readOnly: this.readOnly},
                    {name: "other", inputValue: "other",boxLabel: Lumen.I18N_PROMPTS.other, readOnly: this.readOnly}
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


