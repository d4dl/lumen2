[
    {
        xtype: "container",
        align: "stretch",
        itemId: 'evaluation',
        layout: {
            type: "table",
            columns: 2
        },
        defaults: {
            xtype: "textfield",
            layout: "fit",
            align: "stretch",
            padding: 0,
            border: 0
        },
        items: [
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.ApplicantsCurrentGradeLevel, name: "ApplicantsCurrentGradeLevel", readOnly: this.readOnly},
            {collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.RecommendersEmailAddress, name: "RecommendersEmailAddress", readOnly: this.readOnly}
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
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Howlonghaveyouknowntheapplicant, name: "Howlonghaveyouknowntheapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Howdoyouknowtheapplicant, name: "Howdoyouknowtheapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Inwhatwaysdoesthisapplicantdisplayleadership, name: "Inwhatwaysdoesthisapplicantdisplayleadership", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Inwhatwaysdoesthisapplicantdisplayinclusionsupportofothers, name: "Inwhatwaysdoesthisapplicantdisplayinclusionsupportofothers", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Inwhatwaysdoesthisapplicantdisplayaccountabilityresponsibility, name: "Inwhatwaysdoesthisapplicantdisplayaccountabilityresponsibility", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Breiflydescribethestrengthsofthisapplicant, name: "Breiflydescribethestrengthsofthisapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Breiflydescribeanyacedemicofbehavioralchallengesoftheapplicant, name: "Breiflydescribeanyacedemicofbehavioralchallengesoftheapplicant", readOnly: this.readOnly},
            {xtype: "textareafieldset", collapsible: false, border: false, align: "stretch", collapsed: false, fieldLabel: Lumen.I18N_PROMPTS.Isthereanythingelseweshouldknowaboutthisapplicant, name: "Isthereanythingelseweshouldknowaboutthisapplicant", readOnly: this.readOnly}
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