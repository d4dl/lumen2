[
    {
        html: "<span class='bigHeader'>"+Lumen.I18N_LABELS.documentsEarlyEd+"</span>"
    },
    {
        xtype: "fieldset",
        collapsible: true,
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
                instructions: Lumen.I18N_LABELS.psychologicalEvaluations,
                cls: "documentList",
                documentType: 'psychEval',
                xtype: 'container'
            }
        ]
    },
    {
        xtype: "fieldset",
        skipTraverse: true,
        collabsible: true,
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
                xtype: 'filefieldhtml5' ,
                documentTypeList: 'misc'
            },
            {
                cls: "documentList",
                instructions: Lumen.I18N_LABELS.miscellaneousDocuments,
                documentType: 'misc',
                xtype: 'container'
            }
        ]
    }
]