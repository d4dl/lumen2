[
    //    {
    //        xtype: 'component',
    //        html: "Please fill out the fields below.  An email will be sent to school requesting:"+
    //            "<ol>"+
    //            "<li>Grades/Progress Report at time of withdrawal from your school.</li>"+
    //            "<li>Grades/Progress Reports/Transcripts for all years at your school</li>"+
    //            "<li>Standardized test scores</li>"+
    //            "<li>Medical records</li>"+
    //            "</ol>" +
    //            "<p/>" +
    //            "If you need or the school requires a paper form, it can be downloaded " +
    //            "<a target='_blank' href='http://integrityacademy.org/sites/default/files/New%20Student%20Records%20Release%20Form%202014%20Fillable%20PDF.pdf'>here</a>"
    //    },
    //    {
    //        xtype: "textfield",
    //        vtype: 'email',
    //        name: "RecordsRequest.SchoolName"
    //    },
    //    {
    //        xtype: "textfield",
    //        name: "RecordsRequest.SchoolEmail"
    //    },
    {
        xtype: 'component',
        padding: 4,
        html: "Please download and print the <a target='_blank' href='http://integrityacademy.org/sites/default/files/New%20Student%20Records%20Release%20Form%202014%20Fillable%20PDF.pdf'>records release form</a> " +
            "and send it to your students most recent school." +
            "It can be downloaded " +
            "<a target='_blank' href='http://integrityacademy.org/sites/default/files/New%20Student%20Records%20Release%20Form%202014%20Fillable%20PDF.pdf'>here</a></br>"
    },
    {
        xtype: "bindableradiogroup",
        name: "RecordsReleaseFormSent",
        columns: 2,
        allowBlank: false,
        labelAlign: "top",
        padding: 4,
        fieldLabel: "Check here to indicate that you have or have not sent the form",
        items: [
            {
                boxLabel: 'Yes. I have sent it.',
                inputValue: 'Yes',
                name: "Publicity"
            },
            {
                boxLabel: 'No. I have not sent it.',
                inputValue: 'No',
                name: "Publicity"
            }
        ]
    },
    {
        xtype: "textareafieldset",
        margin: 4,
        fieldLabel: "If for any reason, you are not able to provide a records release form, please provide details below.",
        name: 'NoRecordsReleaseRequest'
    }
]
