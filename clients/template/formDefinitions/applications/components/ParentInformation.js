[
    {
        xtype: "bindableradiogroup",
        fieldLabel: "Describe the applicant's parental status",
        labelAlign: "top",
        name: "ParentalStatus",
        items: [
            {boxLabel: "Married", inputValue: "Married"},
            {boxLabel: "Separated", inputValue: "Separated"},
            {boxLabel: "Divorced", inputValue: "Divorced"},
            {boxLabel: "Widowed", inputValue: "Widowed"},
            {boxLabel: "Single Parent", inputValue: "Single Parent"},
            {boxLabel: "Domestic Partners", inputValue: "Domestic Partners"}
        ]
    },
    {
        xtype: "fieldset",
        name: "HasChildArray[0]",
        canDuplicate: true,
        title: Lumen.i18n("Parent 1 Information"),
        collapsible: true,
        collapsed: true,

        items: [
            {
                xtype: "personname",
                title: Lumen.i18n("Full Name"),
                name: "Parental.Person",
                showTitle: false
            },
            {
                xtype: 'textfield',
                name: "Parental.Person.Email",
                fieldLabel: Lumen.i18n('Email Address'),
                vtype: 'email',
                allowBlank: false
            },
            {
                layout: "fit",
                title: Lumen.i18n("Contact Numbers"),
                name: "Parental.Person.PhoneArray",
                //Note to Joshua
                //This is going to change how numbers are stored.
                //Instead of PhoneArray: [{OrderIndex: 0, Number: "8098"},{...}...]
                //It will be PhoneArray: [8098, 098...]
                collapsible: true,
                cls: "parentPhone",
                xtype: "phonenumber"
            },
            {
                xtype: "address",
                title: Lumen.i18n("Home Address"),
                name: "Parental.Person.AddressArray[0]"
            },
            {
                xtype: "bindableradiogroup",
                name: "PossessionStatus",
                labelAlign: "top",
                fieldLabel: Lumen.i18n("Child lives with this parent"),
                items: [
                    {inputValue: "Full-time", boxLabel: "Full-time"},
                    {inputValue: "Part-time", boxLabel: "Part-time"},
                    {inputValue: "Neither", boxLabel: "Neither"}
                ]
            }
        ]
    },
    {
        xtype: "fieldset",
        title: Lumen.i18n("Parent 2 Information"),
        name: "HasChildArray[1]",
        collapsible: true,
        collapsed: true,
        items: [
            {
                xtype: "personname",
                title: Lumen.i18n("Full Name"),
                name: "Parental.Person",
                showTitle: false
            },
            {
                xtype: 'textfield',
                name: "Parental.Person.Email"   ,
                fieldLabel: 'Email Address',
                vtype: 'email',
                allowBlank: false
            },
            {
                layout: "fit",
                title: Lumen.i18n("Contact Numbers"),
                name: "Parental.Person.PhoneArray",
                //Note to Joshua
                //This is going to change how numbers are stored.
                //Instead of PhoneArray: [{OrderIndex: 0, Number: "8098"},{...}...]
                //It will be PhoneArray: [8098, 098...]
                collapsible: true,
                cls: "parentPhone",
                xtype: "phonenumber"
            },
            {
                xtype: "address",
                title: Lumen.i18n("Home Address"),
                name: "Parental.Person.AddressArray[0]"
            },
            {
                xtype: "bindableradiogroup",
                name: "PossessionStatus",
                labelAlign: "top",
                fieldLabel: Lumen.i18n("Child lives with this parent"),
                items: [
                    {inputValue: "Full-time", boxLabel: "Full-time"},
                    {inputValue: "Part-time", boxLabel: "Part-time"},
                    {inputValue: "Neither", boxLabel: "Neither"}
                ]
            }
        ]
    }

]