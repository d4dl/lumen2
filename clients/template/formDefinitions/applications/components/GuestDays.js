[
    {
        html: "<span class=''>Complete this form to schedule "+ Lumen.i18n("Day visit name") +"(s), parent interviews and student diagnostics.</span>",
        border: false
    },
    {
        xtype: "fieldset",
        title: Lumen.i18n("Day visit name") + Lumen.i18n("(s) Request"),
        name: "GuestDays",
        collapsible: false,
        border: false,
        collapsed: false,
        defaults: {
            layout: "fit",
            border: true,
            collapsible: false,
            collapsed: false,
            allowBlank: false,
            skipTopLevel: true//this gets processed because its in a subset
        },
        items: [
            {
                xtype: "bindableradiogroup",
                allowBlank: false,
                name: "WhenareyouconsideringstartingatOUR_SCHOOL",
                items: [
                    {name: "StartAttendanceConsideration", inputValue: "Immediately", boxLabel: "Immediately"},
                    {name: "StartAttendanceConsideration", inputValue: "Spring Semester", boxLabel: "Spring Semester"},
                    {name: "StartAttendanceConsideration", inputValue: "Next School Year", boxLabel: "Next School Year"},
                    {name: "StartAttendanceConsideration", inputValue: "Other", boxLabel: "Other"}
                ]
            },
            {
                xtype: "bindableradiogroup",
                allowBlank: false,
                name: "HasthestudentandorparentattendedatourorinformationexchangeChooseallthatapply",
                items: [
                    {name: "HasAttendedTour", inputValue: "Parent has attended a tour or information exchange", boxLabel: "Parent has attended a tour or information exchange"},
                    {name: "HasAttendedTour", inputValue: "Student has attended a tour or information exchange", boxLabel: "Student has attended a tour or information exchange"},
                    {name: "HasAttendedTour", inputValue: "Student/Parent plans to attend a tour or information exchange soon", boxLabel: "Student/Parent plans to attend a tour or information exchange soon"},
                    {name: "HasAttendedTour", inputValue: "Other", boxLabel: "Other"}
                ]
            },
            {
                xtype: "textareafieldset",
                allowBlank: false,
                inputHeight: 50,
                name: "DoyouknowanystudentsplanningonattendingOUR_SCHOOLIfsowho"
            },
            {
                xtype: "textareafieldset",
                allowBlank: false,
                inputHeight: 50,
                name: "DoyouknowanyteachersatOUR_SCHOOLIfsowho"
            },
            {
                xtype: "textareafieldset",
                allowBlank: false,
                inputHeight: 50,
                name: "Pleaselisttheclassesyouarecurrentlytakingifany"
            },
            {
                name: "Pleasechoose3differentpossibleweekstoattendDayVisitsvisitsshouldbe2days",
                xtype: "multianswerquestion",
                allowBlank: false,
                subquestions: [
                    {
                        name: "guestDayOption1",
                        itemId: "guestDayDay1",
                        allowBlank: false,
                        xtype: "datefield"
                    },
                    {
                        name: "guestDayOption2",
                        itemId: "guestDayDay2",
                        xtype: "datefield"
                    },
                    {
                        name: "guestDayOption3",
                        itemId: "guestDayDay3",
                        xtype: "datefield"
                    }
                ]
            },
            {
                height: 140,
                name: "DoesyourchildhavepermissiontogoonaclasswalkingexcursionsifoneshouldoccuronaDayVisit",
                xtype: "bindableradiogroup",
                allowBlank: false,
                items: [
                    {name: "ExcursionPermission", inputValue: "Yes - I am comfortable with my child walking on a walking excursion", boxLabel: "Yes - I am comfortable with my child walking on a field trip"},
                    {name: "ExcursionPermission", inputValue: "No - I am not comfortable with my child walking on a walking excursion", boxLabel: "No - I am not comfortable with my child walking on a field trip"}
                ]
            },
            {
                name: "DoesthestudenthaveanyallergiestofoodwheatglutennutsetcPleaselistthem",
                xtype: "bindableradiogroup",
                allowBlank: false,
                items: [
                    {name: "AnyFoodAllergies", inputValue: "Yes", boxLabel: "Yes"},
                    {name: "AnyFoodAllergies", inputValue: "No", boxLabel: "No"}
                ]
            },
            {
                name: "DoesthestudenthaveanyallergiestomedicinesPleaselistthem",
                xtype: "textareafieldset",
                inputHeight: 50,
                allowBlank: false
            },
            {
                xtype: "textareafieldset",
                inputHeight: 50,
                allowBlank: false,
                name: "DoesthestudenthaveanymedicalissuesofwhichweshouldbeawareIfsopleaseexplain"
            },
            {
                name: "DoesOUR_SCHOOLhaveyourpermissiontoprovideemergencycarethroughaclinicemergencyroomhospitalorprivatedoctorifnecessary",
                items: [
                    {name: "EmergencyCareAllowed", inputValue: "Yes", boxLabel: "Yes"},
                    {name: "EmergencyCareAllowed",
                        inputValue: "No (Note: If the answer is no, your child will not be able to attend "+
                            Lumen.i18n('Name of School')+"(s) at "+ Lumen.i18n('Name of School')+".)",
                        boxLabel: "No (Note: If the answer is no, your child will not be able to attend "+
                            Lumen.i18n('Name of School')+"(s) at "+ Lumen.i18n('Name of School')+".)"}
                ],
                allowBlank: false
            },
            {
                xtype: "textareafieldset",
                inputHeight: 70,
                allowBlank: false,
                name: "Isthereanythingelseweshouldknowaboutthestudentbeforeheshevisits"
            },
            {
                xtype: "multianswerquestion",
                allowBlank: false,
                name: "Pleaseputyourinitialsbelow",
                instructions: "By entering my initials below I am indicating that I understand that I am expected to work " +
                    "diligently to ensure that anyone at the School (defined as "+ Lumen.i18n('Name of School')+", its staff, officers, agents, and representatives) who works " +
                    "directly with my child understands my child's food allergy and has the appropriate plan of action in place to minimize food-allergy related " +
                    "risks to my child. I hereby release the School from liability and shall indemnify and hold the School harmless for any injuries, accidents, or " +
                    "other harm that may result from my child's food allergy while in the care of the School.",
                subquestions: [
                    {
                        allowBlank: false,
                        xtype: "textfield"
                    }
                ]
            },
            {
                xtype: "component",
                html: "When finished. Choose 'Submit Request For "+ Lumen.i18n("Day visit name") +"(s)'.  Expect to receive a confirmation email within the next few days letting you know the dates of the Guest Day(s)(s) & letting you know what to bring."
            }
        ]
    }
]