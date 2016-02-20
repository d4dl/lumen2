[
    {
        html: "<div class='instructions'>By filling out the fields below you are acknowledging that the information provided in this form is true and correct to the best of your knowledge.</div>",
        border: false
    },
    {
        xtype: "container",
        //flex: 1,
        layout: {
            type: "table",
            columns: 2
        },
        defaults: {
            labelAlign: "top",
            padding: 10
        },
        items: [
            {
                xtype: "textfield",
                name: "Signature1",
                fieldLabel: "Parent 1 Signature",
                allowBlank: false
            },
            {
                xtype: "textfield",
                fieldLabel: "Parent 2 Signature",
                allowBlank: true,
                name: "Signature2"
            }
        ]
    }
]