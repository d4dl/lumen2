[
    {
        html: "<div class='instructions formContent'>Consent Forms</div>",
        border: false
    },
    {
        html: "<span class='formContent'>Make your selections below to either grant or deny consent for each item.  Click 'Save Consent Form' when you're finished.</span><p/>",
        border: false
    },
    {
        xtype: "container",
        width: "100%",
        defaults: {
            xtype: "textfield",
            labelWidth: 170,
            margin: 5
        },
        layout: {
            type: "table",
            columns: 2
        },
        items: [
            {name: "Consent.StudentName", allowBlank: false, fieldLabel: Lumen.i18n("Student's Name")},
            {name: "Consent.BirthDate", allowBlank: false, xtype: 'datefield', fieldLabel: Lumen.i18n("Student's Date of Birth")}
        ]
    },
    {
        xtype: "bindableradiogroup",
        name: "Consent.OffCampus",
        columns: 2,
        labelAlign: "top",
        fieldLabelIsAgreement: true,
        fieldLabel: Lumen.i18n("<h3>Off-Campus Excursions:</h3>") + Lumen.i18n("I give my consent for Integrity Academy staff members to escort my " +
            "child(ren) to activities which are within walking distance of the Integrity Academy campus. " +
            "I understand that reasonable supervision will be provided for such activities " +
            "(see <a target='_blank' href='http://integrityacademy.org/sites/default/files/IA%20Community%20Handbook%202014.doc'>Student/Parent Handbook</a> " +
            "for details.)"),
        items: [
            {
                boxLabel: 'Yes',
                inputValue: 'Yes',
                name: "Consent.OffCampus"
            },
            {
                boxLabel: 'No',
                inputValue: 'No',
                name: "Consent.OffCampus"
            }
        ]
    },
    {
        xtype: "bindableradiogroup",
        name: "Consent.Publicity",
        labelAlign: "top",
        allowBlank: "false",
        columns: 2,
        fieldLabel: Lumen.i18n("<h3>Publicity:</h3>") + Lumen.i18n("I give my consent for my child(ren) to appear in photographs and/or " +
            "videos created at Integrity Academy. I understand this material will be used for the sole purpose of " +
            "Integrity Academy internal relations (blogs, newsletters, etc) for communication purposes and keeping " +
            "the families informed. I understand that my child’s image will not be used for external marketing purposes " +
            "(brochures, banners, posters) unless I give speciﬁc consent to do so."),
        fieldLabelIsAgreement: true,
        items: [
            {
                boxLabel: 'Yes',
                inputValue: 'Yes',
                name: "Consent.Publicity"
            },
            {
                boxLabel: 'No',
                inputValue: 'No',
                name: "Consent.Publicity"
            }
        ]
    },
    {
        xtype: "bindableradiogroup",
        name: "Consent.PromotionalUse",
        labelAlign: "top",
        columns: 2,
        fieldLabel: Lumen.i18n("<h3>Promotional Use:</h3>") +
            "<span>Request for permission for your child’s photo/image and first name to be published for external publicity or promotional purposes on the school's" +
            "<ul>" +
            "<li>Public website</li>" +
            "<li>Facebook page</li>" +
            "<li>Mail Chimp newsletter to the greater Austin community</li>" +
            "<li>Banners/posters</li>" +
            "<li>Brochures</li>" +
            "</ul></span>",
        fieldLabelIsAgreement: true,
        items: [
            {
                boxLabel: 'We GRANT permission for a photo/image and first name to be published.',
                inputValue: 'We GRANT permission for a photo/image and first name to be published.',
                name: "Consent.PromotionalUse"
            },
            {
                boxLabel: 'I/We DO NOT GRANT permission for photo/image and first name to be published.',
                inputValue: 'I/We DO NOT GRANT permission for photo/image and first name to be published.',
                name: "Consent.PromotionalUse"
            }
        ]
    },
    {
        html: "<hr/>",
        border: false
    },
    {
        padding: 4,
        xtype: "component",
        contentIsValue: true,
        name: "Consent.Directory.Agreement",
        html: "<h3>" + Lumen.i18n("Please check each item for which you give consent to appear in the Integrity Academy Directory:") + "</h3>"
    },
    {
        xtype: "bindableradiogroup",
        labelWidth: "50%",
        padding: 4,
        name: "Consent.Directory.NameInDirectory",
        fieldLabel: "Student(s) name(s) (as shown at the top of this form)",
        items: [
            {
                boxLabel: 'Yes',
                inputValue: 'Yes',
                name: "Consent.Directory.NameInDirectory"
            },
            {
                boxLabel: 'No',
                inputValue: 'No',
                name: "Consent.Directory.NameInDirectory"
            }
        ]
    },
    {
        xtype: "bindableradiogroup",
        labelWidth: "50%",
        padding: 4,
        fieldLabel: "Student(s) date(s) of birth (as shown at the top of this form)",
        name: "Consent.Directory.BirthDateInDirectory",
        items: [
            {
                boxLabel: 'Yes',
                inputValue: 'Yes',
                name: "Consent.Directory.BirthDateInDirectory"
            },
            {
                boxLabel: 'No',
                inputValue: 'No',
                name: "Consent.Directory.BirthDateInDirectory"
            }
        ]
    },
    {
        xtype: "bindableradiogroup",
        labelWidth: "50%",
        padding: 4,
        name: "Consent.Directory.HouseholdInformationInDirectory",
        fieldLabel: "Household 1 information",
        items: [
            {
                boxLabel: 'Yes',
                inputValue: 'Yes',
                name: "Consent.Directory.HouseholdInformationInDirectory"
            },
            {
                boxLabel: 'No',
                inputValue: 'No',
                name: "Consent.Directory.HouseholdInformationInDirectory"
            }
        ]
    },
    {
        padding: 4,
        html: "<h3>"+"By entering my name below, I acknowledge that this authorization content shall remain on file and will be valid until revoked by withdrawing from the program."+"</h3>",
        contentIsValue: true,
        border: false,
        name: "Consent.Agreement"
    },
    {
        xtype: "textfield",
        padding: 4,
        name: "Consent.Signature1",
        fieldLabel: "Signature",
        name: "Signature",
        allowBlank: false
    }
]
