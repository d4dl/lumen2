[
    {
        html: "<span class='bigHeader'>"+Lumen.I18N_LABELS.documentsInternational+"</span>"
    },
    {
        xtype: "fieldset",
        collabsible: true,
        title: "Latest report card and transcripts, if applicable",
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
                instructions: Lumen.I18N_LABELS.reportCardsTranscripts,
                cls: "documentList",
                documentType: 'reportCardTranscript',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        title: "Immunization records",
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
                documentTypeList: 'immunization'
            },
            {
                instructions: Lumen.I18N_LABELS.immunizationRecords,
                cls: "documentList",
                documentType: 'immunization',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        title: "Psychological Evaluations",
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
                documentTypeList: 'psychEval'
            },
            {
                instructions: Lumen.I18N_LABELS.psychologicalEvaluations,
                cls: "documentList",
                documentType: 'psychEval',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        title: "Miscellaneous",
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
                documentTypeList: 'misc'
            },
            {
                instructions: Lumen.I18N_LABELS.miscellaneousDocuments,
                cls: "documentList",
                documentType: 'misc',
                xtype: 'container'
            }
        ]
    }
]