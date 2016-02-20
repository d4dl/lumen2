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
                collapsed: false,
                name: "Pleaseusethisspacetoprovideanyotherhelpfulinformationaboutyourchild",
                allowBlank: true
            },
            {
                xtype: "bindablecheckboxgroup",
                columns: 3,
                name: "HowdidyouhearaboutOUR_SCHOOL",
                items: [
                    {name: "HowYouHeardAboutUs", inputValue: "Internet", boxLabel: "Internet"},
                    {name: "HowYouHeardAboutUs", inputValue: "Word of Mouth", boxLabel: "Word of Mouth"},
                    {name: "HowYouHeardAboutUs", inputValue: "DO512.com", boxLabel: "DO512.com"},
                    {name: "HowYouHeardAboutUs", inputValue: "Edible Austin", boxLabel: "Edible Austin"},
                    {name: "HowYouHeardAboutUs", inputValue: "ETA school fair", boxLabel: "ETA school fair"},
                    {name: "HowYouHeardAboutUs", inputValue: "Casa De Luz", boxLabel: "Casa De Luz"},
                    {name: "HowYouHeardAboutUs", inputValue: "Other", boxLabel: "Other"}
                ]
            },
            {
                xtype: "bindableradiogroup",
                name: "WhatisyourbestestimateforhowlongyouplantoremainatOUR_SCHOOL",
                items: [
                    {name: "EstimateToRemainAtSchool", inputValue: "Through Middle School", boxLabel: "Through Middle School"},
                    {name: "EstimateToRemainAtSchool", inputValue: "Through High School", boxLabel: "Through High School"}
                ]
            }
        ]
    }
]