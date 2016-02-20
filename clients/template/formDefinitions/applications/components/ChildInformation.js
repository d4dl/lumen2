[
    {
        xtype: "container",
        layout: "hbox",
        items: [
        ]
    },
    {
        xtype: "personname",
        title: Lumen.i18n("Full Name"),
        itemId: "studentApplicantName",
        name: "Child.Person",
        showTitle: false
    },
    //    {
    //        xtype: "fieldset",
    //        title: Lumen.i18n("Photo"),
    //        cls: "childPhotoDrop",
    //        width: 200,
    //        height: 251,
    //        items: [
    //            {
    //                layout: "fit",
    //                xtype: "imagedrop",
    //                width: 180,
    //                height: 200
    //            }
    //        ]
    //    },
    {
        xtype: "container",
        allowBlank: false,
        layout: {
            type: "table",
            columns: 2
        },
        items: [

            {
                xtype: "combobox",
                store: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12],
                typeAhead: true,
                triggerAction: 'all',
                emptyText:'Select a grade...',
                selectOnFocus:true,
                name: "Child.Person.Grade",
                fieldLabel: Lumen.i18n("Entering Grade"),
                //title: Lumen.i18n("Entering Level (1-7)"),
                border: false,
                collapsible: false
            },
            {
                xtype: "datefield",
                format: "Y-m-d",
                fieldLabel: Lumen.i18n("Date of Birth"),
                name: "Child.Person.BirthDate",
                title: "Birth Date",
                required: true,
                border: false,
                collapsible: false
            },
            {
                xtype: "bindableradiogroup",
                required: true,
                width: 400,
                cls: 'gender',
                fieldLabel: Lumen.i18n('Gender'),
                collapsed: false,
                layout: {
                    type: "hbox"
                },
                border: false,
                collapsible: false,
                defaultType: 'radiofield',
                name: "Child.Person.Gender",
                items: [
                    {
                        boxLabel: 'Male',
                        inputValue: 'Male'
                    },
                    {
                        boxLabel: 'Female',
                        inputValue: 'Female'
                    }
                ]
            }
        ]
    }
]