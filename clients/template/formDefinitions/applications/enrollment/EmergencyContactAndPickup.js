[
    {fieldLabel: "First Name", name: "FirstName"},
    {fieldLabel: "Last Name", name: "LastName"},
    {fieldLabel: "Relationship", name: "Relationship"},
    {
        xtype: "bindableradiogroup",
        fieldLabel: "Authorized to pickup?",
        name: "AuthorizedToPickup",
        items: [
            {inputValue: "Yes", boxLabel: "Yes"},
            {inputValue: "No", boxLabel: "No"}
        ]
    },
    {fieldLabel: "Home Phone", name: "HomePhone"},
    {fieldLabel: "Cell Phone", name: "WorkPhone"},
    {fieldLabel: "Mobile Phone", name: "MobilePhone"}
//    ,
//    {
//        xtype: "removebutton",
//        cls: "tableButton",
//        text: "Remove this contact"
//    }
]
