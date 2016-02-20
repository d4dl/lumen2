[
    {
        html: "<div class='formContent instructions'>" +
            "According to <a target='_blank' href='http://www.dfps.state.tx.us/documents/Child_Care/Child_Care_Standards_and_Regulations/Chapter_42_Texas_Human_Resources_Code.pdf'>" +
            "TXDFPS standard 746.611</a> all children must have a health statement on " +
            "file for all children in care within one week of enrollment.</div>",
        border: false
    },
    {
        xtype: "component",
        html: "<div class='formContent'>" +
            "<ol type='a'> " +
            "<li>A health statement is:</li> " +
            "<ol> " +
            "<li>A writing statement, from a health‐care professional who has examined the child within the " +
            "past 12 months, indicating that the child is able to take part in the childcare program; or</li> " +
            "<li>A signed affidavit from the parent stating that medical diagnosis and treatment conflict " +
            "with the tenets and practices of a recognized religious organization of which the parent is " +
            "an adherent or a member; or</li> " +
            "<li>A signed statement from the parent giving the name and address of a healthcare professional " +
            "who has examined the child within the past year stating that the child is able to participate " +
            "in the program. This must be followed by a signed statement from a health‐care professional as " +
            "specified in paragraph 1. of this subsection within 12 months of the date of admission.</li> " +
            "</ol> " +
            "<li>You must have a health statement on file at the center, within one week after the date of " +
            "admission, for the each child who does not attend pre‐kindergarten or school away from the " +
            "child‐care center.</li> " +
            "</ol>" +
            "</div>"
    },
    {
        subsituteVariables: true,
        xtype: "component",
        name: "Agreement",
        contentIsValue: true,
        html: "<div class='formContent'>By entering my name below, I am certifying that " +
            "__STUDENT_NAME__ has been examined by the doctor listed below within the past year and is deemed " +
            "able to participate in the program at Integrity Academy at Casa de Luz, Center for Integral Studies. " +
            "I acknowledge that this letter must be followed by a signed statement from a health‐care professional " +
            "as specified in paragraph 1. of this subsection within 12 months of the date of admission.</div>"

    },
    {
        xtype: "textfield",
        padding: 4,
        name: "Signature1",
        fieldLabel: "Signature",
        allowBlank: false
    },
    {
        xtype: "component",
        html: "<p/>"
    },
    {xtype: 'textfield', fieldLabel: 'Doctor Name', name: 'DoctorName', allowBlank: false},
    {xtype: 'textfield', fieldLabel: 'Office Name', name: 'DoctorOffice'},
    {xtype: 'textfield', fieldLabel: 'Office Address', name: 'DoctorOfficeAddress', allowBlank: false},
    {xtype: 'textfield', fieldLabel: 'Office Phone', name: 'DoctorOfficePhone', allowBlank: false}
]