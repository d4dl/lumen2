[
    {
        xtype: "container",
        collapsible: false,
        defaults: {
            xtype: "textareafieldset",
            layout: "fit",
            align: "stretch",
            padding: 0,
            border: 0
        },
        items: [
            {
                question: "Why do you think "+ Lumen.i18n('Name of School')+" could be a good match for your child and your family?"
            },
            {
                question: "Does your family have any previous alternative education experience? If so, please describe."
            },
            {
                question: "Child's previous and/or current school experience: Was it a good fit? Why or why not?"
            },
            {
                question: "What are your top three reasons for choosing alternative education for Childhood/Elementary?"
            },
            {
                xtype: "fieldset",
                collabsible: true,
                layout: {
                    columns: 1
                },
                title: Lumen.i18n("Latest report card"),
                skipTraverse: true,
                defaults: {
                    listeners: {
                        'FILE_ADDED': function(e, t, opts) {
                            //alert("Hit the immunization file added listener.");
                            //This works.
                            var o=0;
                        }
                    }
                },
                items: [
                    {
                        xtype: 'filefieldhtml5',
                        documentTypeList: 'reportCardTranscript'
                    },
                    {
                        cls: "documentList",
                        instructions: Lumen.I18N_LABELS.reportCards,
                        documentType: 'reportCardTranscript',
                        xtype: 'container'
                    }
                ]
            }
        ]
    }
]