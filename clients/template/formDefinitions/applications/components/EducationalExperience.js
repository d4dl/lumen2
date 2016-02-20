[
    {
        xtype: "container",
        collapsible: false,
        defaults: {
            xtype: "textareafieldset",
            layout: "fit",
            align: "stretch",
            padding: 0,
            border: 0
        },
        items: [

            {
                xtype: "multianswerquestion",
                columns: 4,
                title: Lumen.i18n("CurrentPastSchoolsAttended"),
                name: "CurrentPastSchoolsAttended",
                defaults: {
                    xtype: "textfield"
                },
                subquestions: [
                    {name: "NameofSchool"},
                    {name: "CityState"},
                    {name: "GradesAttended"},
                    {name: "DatesAttended"},
                    {name: "NameofSchool"},
                    {name: "CityState"},
                    {name: "GradesAttended"},
                    {name: "DatesAttended"},
                    {name: "NameofSchool"},
                    {name: "CityState"},
                    {name: "GradesAttended"},
                    {name: "DatesAttended"},
                    {name: "NameofSchool"},
                    {name: "CityState"},
                    {name: "GradesAttended"},
                    {name: "DatesAttended"}
                ]
            },
            {
                xtype: "multianswerquestion",
                columns: 3,
                title: Lumen.i18n("Siblings"),
                name: "Siblings",
                defaults: {
                    xtype: "textfield"
                },
                subquestions: [
                    {name: "NameofSibling"},
                    {name: "DateofBirth"},
                    {name: "CurrentSchoolGrade"},
                    {name: "NameofSibling"},
                    {name: "DateofBirth"},
                    {name: "CurrentSchoolGrade"},
                    {name: "NameofSibling"},
                    {name: "DateofBirth"},
                    {name: "CurrentSchoolGrade"},
                    {name: "NameofSibling"},
                    {name: "DateofBirth"},
                    {name: "CurrentSchoolGrade"}
                ]
            },
            {
                name: "WhatareyoulookingforinaschoolWhatqualitieswouldyousayaremostimportantforyourchildandfamily"
            },
            {
                name: "Whyareyouseekinganalternativetoyourchildscurrenteducationalsetting"
            },
            {
                name: "descriptionOfHomeSchoolingExperience"
            },
            {
                name: "Whatlevelkindofinvolvementdoyouhaveinyourchildscurrenteducationalsetting"
            }
        ]
    }
]