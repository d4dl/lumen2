[
    {
        xtype: "container",
        collapsible: false,
        instructions: "At "+ Lumen.i18n('Name of School')+", we are committed to providing the best educational " +
            "experience for our students. The following information is requested to make sure we can meet a child's " +
            "academic and social needs. While we welcome a diverse group of students, "+ Lumen.i18n('Name of School')+" " +
            "is not staffed to meet the needs of children who have behavioral or educational problems for which " +
            "specially-trained teachers are necessary",
        defaults: {
            xtype: "textareafieldset",
            layout: "fit",
            align: "stretch",
            padding: 0,
            border: 0
        },
        items: [
            {
                name: "HasyourchildeverrepeatedagradeorbeendismissedfromschoolIfyespleasedescribe"
            },
            {
                xtype: "bindablecheckboxgroup",
                name: "Hasyourchildeverbeenenrolledinanyofthefollowing",
                allowMultiple: true,
                ResponseChoiceArray: [
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "A special ed. program for learning differences", boxLabel: "A special ed. program for learning differences"},
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "Speech therapy", boxLabel: "Speech therapy"},
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "Occupational therapy", boxLabel: "Occupational therapy"},
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "A gifted/talented program", boxLabel: "A gifted/talented program"},
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "Other special programs", boxLabel: "Other special programs"},
                    {name: "OtherSpecialNeedsEnrollments", inputValue: "None", boxLabel: "None"}
                ]
            },
            {
                name: "Ifyouselectedyestoanyoftheabovepleasedescribe"
            },
            {
                name: "Hasyourchildeverbeentestedorreceivedspecialhelpforareadingorlearningdifficulty"
            },
            {
                name: "Pleasedescribeanyillnessesdiseasesorphysicaldisabilitieswhicheitherhaveaffectedormayaffectyourchildshealthschoolworkorparticipationinactivities"
            },
            {
                name: "DoesyourchildregularlyrequireanymedicationIfyespleaseexplain"
            },
            {
                name: "HasyourchildeverbeenevaluatedforordiagnosedwithanylearningemotionalorpsychologicaldisabilitiesIfyespleaseexplain"
            },
            {
                name: "HasoutsidesupportbeenrecommendedforyourchildIfyespleaseexplain"
            }
        ]
    }
]