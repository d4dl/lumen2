[
    {
        html: "<div class='instructions formContent'>" +
            "Vision and Hearing Screening</div>",
        border: false
    },
    {
        xtype: "component",
        html: "<span class='formContent'>On Sight Vision and Hearing Screening Service will be conducting spinal screenings on <strong>July 12, 2015</strong>. " +
            "The purpose of spinal screening is to detect the signs of abnormal curves of the spine at their earliest stages so that the need for treatment " +
            "can be determined. It is usually detected in children between 10 and 14 years of age. Kyphosis, sometimes called round back, is an exaggerated " +
            "rounding of the upper back and is often confused with poor posture. Many cases of curvature of the spine are mild and require only ongoing " +
            "observation by a physician when they are first diagnosed. Others can worsen with time as the child grows and require active treatment such as " +
            "bracing and surgery. Early treatment can prevent the development of a severe deformity, which can affect a person's appearance and health.</span>" +
            "</p>" +
            "<span class='formContent'>The procedure for screening is simple. As a certified screener, we have been specially trained and will look at your " +
            "child's back while he/she stands and then bends forward. For this examination, boys and girls will be seen separately and individually.</span>" +
            "</p>" +
            "<span class='formContent'>STUDENTS SHOULD WEAR OR BRING <strong>SHORTS</strong> TO SCHOOL FOR THE EXAM ALL STUDENTS MUST REMOVE THEIR SHIRT FOR " +
            "THIS EXAM. FOR THIS REASON, WE REQUEST THAT <strong>GIRLS</strong> WEAR A <strong>HALTER TOP, TUBE TOP, SPORTS BRA, OR A TWO PIECE SWIMSUIT TOP " +
            "UNDERNEATH THEIR SHIRT</strong> ON EXAM DAY.</span>" +
            "</p>" +
            "<span class='formContent'>Parents will be notified of the results of the screening only if professional follow-up is necessary. This screening " +
            "procedure does not replace your child's need for regular health care and checkups.</span>" +
            "</p>" +
            "<span class='formContent'>The Special Senses and Communications Disorders Act requires that schools show proof that vision and hearing tests have been performed on all pre-k, kindergarten, 1st, 3rd, 5th and 7th grade students." +
            "All students in grades 6 and 9 (or grades 5 and 8) must receive the spinal screening in accordance with state law. If, for " +
            "religious reasons, you do not wish to have your child screened, you are to submit an affidavit of religious exemption to your school.</span>" +
            "</p>" +
            "<span class='formContent'>The cost of the spinal screening is $20.(<strong>If you are also having vision/hearing screening done, the cost is " +
            "$35 for all three tests</strong>.) Please send cash or a personal check made out to your school.</span>" +
            "</p>" +
            "On Sight Vision and Hearing Screening: 512-468-9416"

    },
    {
        xtype: "component",
        html: "The following information would be helpful if your child is participating in the screening:"
    },
    {
        xtype: 'productcheckboxgroup',
        columns: 3,
        productAmounts: [2200, 2700, 3700],
        items: [
            {
                boxLabel: Lumen.i18n("Spinal Screening", Lumen.PROMPT),
                name: 'spinalScreening'
            },
            {
                boxLabel: Lumen.i18n("Vision Screening", Lumen.PROMPT),
                name: 'visionScreening'
            },
            {
                boxLabel: Lumen.i18n("Hearing Screening", Lumen.PROMPT),
                name: 'hearingScreening'
            },
            {
                boxLabel: "I am choosing not to participate in this program and understand that I must " +
                    "furnish the school with a copy of the results of these tests if my child meets the " +
                    "above criteria. My child has a doctor's appointment scheduled I " +
                    "will give the results to the school the next day.",
                name: 'optOut',
                clearOthers: true,
                productAmount: 00
            }
        ]

    },
    {
        xtype: "textareafieldset",
        title: Lumen.i18n("Do you have any concerns about your child's vision or hearing?"),
        allowBlank: false,
        name: "Screening.VisionHearingConcerns"
    },
    {
        xtype: "textareafieldset",
        title: Lumen.i18n("Do you have any concerns about your child's spine or posture?"),
        allowBlank: false,
        name: "Screening.VisionHearingConcerns"
    }
]