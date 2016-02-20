[
    {
        html: "<span class='bigHeader'>"+Lumen.I18N_LABELS.documentsHSMS+"</span>",
        border: false
    },
    {
        xtype: "fieldset",
        collabsible: true,
        title: Lumen.i18n("Latest report card and transcripts, if applicable"),
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
                instructions: Lumen.I18N_LABELS.reportCardsTranscripts,
                documentType: 'reportCardTranscript',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        skipTraverse: true,
        title: Lumen.i18n("Immunization records"),
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
                cls: "documentList",
                instructions: Lumen.I18N_LABELS.immunizationRecords,
                documentType: 'immunization',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        skipTraverse: true,
        title: Lumen.i18n("Psychological Evaluations"),
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
                cls: "documentList",
                instructions: Lumen.I18N_LABELS.psychologicalEvaluations,
                documentType: 'psychEval',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        collabsible: true,
        skipTraverse: true,
        title: Lumen.i18n("Miscellaneous"),
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