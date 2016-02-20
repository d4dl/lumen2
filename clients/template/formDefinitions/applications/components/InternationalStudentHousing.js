[
    {
        html: "<span class='bigHeader'>Supplemental Information for International Students</span>"
    },
    {
        xtype: "textfield",
        question: "Country of birth",
        combobox: {
            xtype: 'combobox',
            listeners:{change: this.onChange, scope: this},
            displayField: 'name',
            valueField: 'name',
            queryMode: 'local',
            store: Ext.create("Lumen.store.CountryStore"),
            emptyText: 'Country',
            margins: '0 6 0 0',
            allowBlank: false,
            forceSelection: true,
            fieldLabel: 'Country',width: 224,allowBlank: false
        }
    },
    {
        xtype: "textfield",
        question: "Country of citizenship"
    },
    {
        xtype: "textfield",
        question: "Language spoken"
    },
    {
        xtype: "textfield",
        question: "Entering grade"
    },
    {
        xtype: "textfield",
        question: "Student email"
    },
    {
        xtype: "multiplechoicequestion",
        question: "Have you ever been issued an I-20 before?",
        ResponseChoiceArray: [
            "yes",
            "no"
        ]
    },
    {
        xtype: "textfield",
        question: "If yes, by which institution?"
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: false,
        question: "How long are you planning to study at DeFord Academy?",
        ResponseChoiceArray: ["One semester",
             "One year",
            "I intend to graduate from DeFord Academy"
        ]
    },
    {
        xtype: "multianswerquestion",
        question: "Agency contact information.",
        subquestions: [
            {question: "Agency name &#40;or put n/a if you don't have one&#41;"},
            {question: "Email of agenct/agency"}
        ]
    },
    {
        xtype: "multiplechoicequestion",
        question: "Should DeFord Academy should include you host family in weekly email updates?",
        ResponseChoiceArray: ["yes", "no"]

    },
    {
        xtype: "container",
        title: "Please provide the name and email address of any other people that should receive weekly updates.",
        layout: {
            type: "table",
            columns: 2
        },
        items: [
            {
                xtype: "container",
                columns: 2,
                collapsible: false,
                border: false,
                subquestions: [
                    {
                        question: "Email",
                        xtype: "textfield"
                    },
                    {
                        question: "Name",
                        xtype: "textfield"
                    }
                ]
            },
            {
                xtype: "container",
                columns: 2,
                collapsible: false,
                border: false,
                subquestions: [
                    {
                        question: "Email",
                        xtype: "textfield"
                    },
                    {
                        question: "Name",
                        xtype: "textfield"
                    }
                ]
            },
            {
                xtype: "container",
                columns: 2,
                collapsible: false,
                border: false,
                subquestions: [
                    {
                        question: "Email",
                        xtype: "textfield"
                    },
                    {
                        question: "Name",
                        xtype: "textfield"
                    }
                ]
            },
            {
                xtype: "container",
                columns: 2,
                collapsible: false,
                border: false,
                subquestions: [
                    {
                        question: "Email",
                        xtype: "textfield"
                    },
                    {
                        question: "Name",
                        xtype: "textfield"
                    }
                ]
            }
        ]
    },
    {
        xtype: "multiplechoicequestion",
        question: "Should DeFord Academy should include you host family in weekly <i>personal student</i> updates?",
        ResponseChoiceArray: ["yes", "no"]
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: false,
        question: "To whom should DeFord Academy should send grade reports?",
        ResponseChoiceArray: ["to my Agency &#40;who will then send them on to my parents&#41;",
            "directly to my parents",
            "to my host family"
        ]
    },
    {
        xtype: "textfield",
        question: "Have you ever lived outside your country?",
        ResponseChoiceArray: ["yes", "no"]

    },
    {
        xtype: "textfield",
        question: "If yes, where and when?"
    },
    {
        xtype: "textfield",
        question: "Did you live with a host family during this time?"
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: true,
        question: "Which of the following English proficiency tests have you taken?",
        ResponseChoiceArray: ["SLEP",
            "TOEFL Junior",
            "TOEFL",
            "Other"
        ]
    },
    {
        xtype: "textfield",
        question: "Date taken"
    },
    {
        xtype: "textfield",
        question: "Score received"
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: true,
        question: "After-school activities in which you may have interest:",
        ResponseChoiceArray:["Choir",
            "Flag football &#40;for boys&#41;",
             "Volleyball &#40;for girls&#41;",
            "Basketball",
            "Soccer &#40;Futbol&#41;",
            "Outdoor Leadership &#40;hiking, camping, kayaking, etc.&#41;",
             "Science Research Group"
        ]
    },
    {
        xtype: "multiplechoicequestion",
        type: "checkbox",
        allowMultiple: true,
        question: "Austin transportation with which you feel comfortable:",
        ResponseChoiceArray: ["Riding a city bus",
            "Riding a train",
            "Riding a shuttle from one DeFord Academy campus to another &#40;if a certain campus is closer to your host family then the Rio Grande campus&#41;",
            "Riding a bicycle to school &#40;if the host family lives close enough&#41;",
            "Walking to school &#40;if the host family lives close enough&#41;",
            "none of the above"
        ]
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: false,
        question: "Many American families have pets.  Are you willing to live with a family who owns a pet?",
        ResponseChoiceArray: ["yes",
            "no"
        ]
    },
    {
        xtype: "textfield",
        question: "Specifics about living with a pet"
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: false,
        question: "Do you have allergies?",
        ResponseChoiceArray: ["yes",
             "no"
        ]
    },
    {
        xtype: "longquestion",
        question: "If yes, please list"
    },
    {
        xtype: "multiplechoicequestion",
        allowMultiple: false,
        question: "Do you have dietary concerns?",
        ResponseChoiceArray: ["yes",
            "no"
        ]
    },
    {
        xtype: "longquestion",
        question: "If yes, please list"
    },
    {
        xtype: "multianswerquestiongrid",
        question: "Personality Profile: please check all that apply:",
        headers: [
            {question: "Adaptable/Flexible"},
            {question: "Athletic"},
            {question: "Calm"},
            {question: "Cheerful"}
        ],
        ResponseChoiceArray:[
            "Friendly",
            "Generous",
            "Good with Younger Kids",
            "Independent",
            "Neat/Tidy",
            "Open-Minded",
            "Outgoing",
            "Patient",
            "Pessimist",
            "Polite",
            "Positive",
            "Quiet",
            "Reserved",
            "Responsible",
            "Sensitive",
            "Serious",
            "Shy",
            "Spontaneous",
            "Stubborn",
            "Talkative"
        ]
    },
    {
        xtype: "container",
        layout: "vbox",
        items: [
            {
                html: "By completing the signature fields below you are signifying that you understand the following requirements for students living with host families &#40;during their stay in Austin&#41;"
            },
            {
                items: [
                    {
                        xtype: "container",
                        layout: "vbox",
                        items: [
                            {xtype: 'displayfield',value: 'a. The student will follow the rules of the agency, if the student is involved with and exchange agency.'},
                            {xtype: 'displayfield',value: 'b. The student will not drive a motorized vehicle &#40;a car, motorcycle, scooter, etc.'},
                            {xtype: 'displayfield',value: 'c. The student will not smoke cigarettes, drink alcohol, misuse legal medications, or use any illegal drug.'},
                            {xtype: 'displayfield',value: 'd. The student will not have sex.'},
                            {xtype: 'displayfield',value: 'e. The student will not participate in hunting or any gun-related activities/events.'},
                            {xtype: 'displayfield',value: 'f. The student will have medical insurance and a debit or credit card, arranged by his/her parents or exchange agency.'}
                        ]
                    }
                ]
            },
            {
                html: "<span class='bigHeader'>I understand and agree to abide by DeFord Academy's requirements of foreign exchange students.  I understand that breaking any of these agreements could result in being sent back home.</span>"
            },
            {
                xtype: "container",
                flex: 1,
                layout: {
                    type: "table",
                    columns: 2
                },
                items: [
                    {
                        xtype: "textfield",
                        fieldLabel: "Student Signature",
                        name: "Student.Signature1"
                    },
                    {
                        xtype: "datefield",
                        fieldLabel: "Date",
                        name: "Student.Signature1Date"
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "Parent Signature",
                        name: "Parent.Signature2"
                    },
                    {
                        xtype: "datefield",
                        fieldLabel: "Date",
                        name: "Parent.Signature2Date"
                    }
                ]
            }
        ]
    }
]