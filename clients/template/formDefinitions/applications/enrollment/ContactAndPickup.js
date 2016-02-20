[
    {
        html: "<div class='instructions formContent'>" +
            "Emergency and Pickup Information</div>",
        border: false
    },
    {
        xtype: "component",
        name: "Agreement",
        contentIsValue: true,
        html: "<div class='formContent'><span class='inlineHeading'>Emergency Treatment</span> – " +
            "If, in the judgment of the School (defined as Integrity Academy, " +
            "its directors, officers, agents, and representatives), my child(ren) need(s) immediate " +
            "care and treatment as a result of any accident, injury, illness, or other medical need " +
            "while at the school or during a school-related function, I/we hereby request, authorize, " +
            "consent, and otherwise grant permission to the School to render or obtain care and " +
            "treatment for my child(ren.) I/We authorize the School to obtain care and treatment " +
            "for my child(ren) from any physician, nurse, hospital, or other licensed professional. " +
            "I/We authorize my child(ren) to be transported by ambulance, life flight, or by other " +
            "appropriate rescue means or personnel when necessary for my child (ren)'s safety or " +
            "well-being. I/We shall reimburse the School for any costs associated with such treatment " +
            "or transportation. I/We hereby release the School from liability and shall indemnify " +
            "and hold the School harmless for any injuries, accidents, or other harm that may result " +
            "from such care and treatment or transportation of my child(ren).</div>"
    },
    {
        xtype: "bindableradiogroup",
        fieldLabel: "<h3>I Consent</h3>",
        fieldLabelIsValue: true,
        labelAlign: "top",
        name: "ConsentGranted",
        columns: 2,
        width:"25%",
        items: [
            {boxLabel: "Yes", inputValue: "Yes"},
            {boxLabel: "No", inputValue: "No"}
        ]
    },
    {
        xtype: "component",
        html: "<h3>Contact 1</h3>"
    },
    {
        title: Lumen.i18n("Emergency Contacts"),
        xtype: "appformloader",
        header: false,
        width: "100%",
        border: false,
        name: "Contact[0]",
        layout: {
            type: "table",
            columns: 4
        },
        defaults: {
            xtype: "textfield",
            fieldCls: "paddedFieldLabel",
            labelAlign: "top"
        },
        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/EmergencyContactAndPickup.js"
    },
    {
        xtype: "component",
        html: "<h3>Contact 2</h3>"
    },
    {
        title: Lumen.i18n("Emergency Contacts"),
        header: false,
        xtype: "appformloader",
        width: "100%",
        border: false,
        name: "Contact[1]",
        layout: {
            type: "table",
            columns: 4
        },
        defaults: {
            xtype: "textfield",
            fieldCls: "paddedFieldLabel",
            labelAlign: "top"
        },
        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/EmergencyContactAndPickup.js"
    },
    {
        xtype: "component",
        html: "<h3>Contact 3</h3>"
    },
    {
        title: Lumen.i18n("Emergency Contacts"),
        header: false,
        xtype: "appformloader",
        width: "100%",
        border: false,
        name: "Contact[2]",
        layout: {
            type: "table",
            columns: 4
        },
        defaults: {
            xtype: "textfield",
            fieldCls: "paddedFieldLabel",
            labelAlign: "top"
        },
        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/EmergencyContactAndPickup.js"
    },
    {
        xtype: "component",
        html: "<h3>Contact 4</h3>"
    },
    {
        title: Lumen.i18n("Emergency Contacts"),
        header: false,
        xtype: "appformloader",
        width: "100%",
        border: false,
        name: "Contact[3]",
        layout: {
            type: "table",
            columns: 4
        },
        defaults: {
            xtype: "textfield",
            fieldCls: "paddedFieldLabel",
            labelAlign: "top"
        },
        url: Lumen.FORM_DEFINITION_URL_PREFIX + "/enrollment/EmergencyContactAndPickup.js"
    }
]