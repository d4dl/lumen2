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
        defaults: {
            xtype: "textfield",
            layout: "fit",
            align: "stretch",
            padding: 0,
            border: 0
        },
        items:[

            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.ApplicantsCurrentGradeLevel, name:"ApplicantsCurrentGradeLevel", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.NameofSchool, name:"NameofSchool", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.CityStateWhereSchoolisLocated, name:"CityStateWhereSchoolisLocated", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Howlonghaveyouknowntheapplicant, name:"Howlonghaveyouknowntheapplicant", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Whatcourseshaveyoutaughtthisapplicant, name:"Whatcourseshaveyoutaughtthisapplicant", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Whatlevelwasthecourse, name:"Whatlevelwasthecourse", readOnly: this.readOnly}
        ]
    },
    {
        xtype: "component",
        cls: "sectionInstructions",
        html: Lumen.I18N_PROMPTS.Pleaseevaluatethestudentonthefollowingattributes
    },
    {
        xtype:"container",
        cls: "surveyQuestionGrid",
        showCellLabels:true,
        defaults:{
            xtype: "bindableradiogroup",
            flex: 5,
            items:[
                {name: "Assessment", inputValue: "Exceptional", boxLabel: Lumen.I18N_PROMPTS.Exceptional},
                {name: "Assessment", inputValue: "Above Average", boxLabel: Lumen.I18N_PROMPTS.AboveAverage},
                {name: "Assessment", inputValue: "Average", boxLabel: Lumen.I18N_PROMPTS.Average},
                {name: "Assessment", inputValue: "Below Average", boxLabel: Lumen.I18N_PROMPTS.BelowAverage},
                {name: "Assessment", inputValue: "Deficient", boxLabel: Lumen.I18N_PROMPTS.Deficient},
                {name: "Assessment", inputValue: "No opinion", boxLabel: Lumen.I18N_PROMPTS.Noopinion}
            ]
        },
        items:[
            {collapsed: false, name: "Abilitytoretainmathematicalconcepts", fieldLabel: Lumen.I18N_PROMPTS.Abilitytoretainmathematicalconcepts, readOnly: this.readOnly},
            {collapsed: false, name: "Abilitytoapplymathematicalconcepts", fieldLabel: Lumen.I18N_PROMPTS.Abilitytoapplymathematicalconcepts, readOnly: this.readOnly},
            {collapsed: false, name: "Abilitytouseanadvancedcalculator", fieldLabel: Lumen.I18N_PROMPTS.Abilitytouseanadvancedcalculator, readOnly: this.readOnly},
            {collapsed: false, name: "Masteryofbasicmathematicalproblems", fieldLabel: Lumen.I18N_PROMPTS.Masteryofbasicmathematicalproblems, readOnly: this.readOnly},
            {collapsed: false, name: "Potentialforintellectualgrowth", fieldLabel: Lumen.I18N_PROMPTS.Potentialforintellectualgrowth, readOnly: this.readOnly},
            {collapsed: false, name: "Abilitytoworkindependently", fieldLabel: Lumen.I18N_PROMPTS.Abilitytoworkindependently, readOnly: this.readOnly},
            {collapsed: false, name: "Abilitytoworkingroups", fieldLabel: Lumen.I18N_PROMPTS.Abilitytoworkingroups, readOnly: this.readOnly},
            {collapsed: false, name: "Contributestothesuccessofothers", fieldLabel: Lumen.I18N_PROMPTS.Contributestothesuccessofothers, readOnly: this.readOnly},
            {collapsed: false, name: "Exhibitseffortanddetermination", fieldLabel: Lumen.I18N_PROMPTS.Exhibitseffortanddetermination, readOnly: this.readOnly},
            {collapsed: false, name: "Completeshomeworkwithaccuracy", fieldLabel: Lumen.I18N_PROMPTS.Completeshomeworkwithaccuracy, readOnly: this.readOnly},
            {collapsed: false, name: "Showsrespecttoteachers", fieldLabel: Lumen.I18N_PROMPTS.Showsrespecttoteachers, readOnly: this.readOnly},
            {collapsed: false, name: "Showsrespecttopeers", fieldLabel: Lumen.I18N_PROMPTS.Showsrespecttopeers, readOnly: this.readOnly},
            {collapsed: false, name: "Takesnoteswithaccuracy", fieldLabel: Lumen.I18N_PROMPTS.Takesnoteswithaccuracy, readOnly: this.readOnly}

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
            {xtype: "textareafieldset", collapsible: false, border: false, collapsed: false, name:"Breiflydescribethestrengthsofthisapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, collapsed: false, name:"Breiflydescribeanyacedemicofbehavioralchallengesoftheapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, collapsed: false, name:"Isthereanythingelseweshouldknowaboutthisapplicant", readOnly: this.readOnly}

        ]
    },    {
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