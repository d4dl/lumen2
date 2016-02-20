[
    {
        xtype: 'container',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            xtype: 'component'
        },
        items: [
            {
                html: "<span class='sectionTitle'>Integrity Academy Guidelines for Students with Food Allergies</span>,<br/>" +
                    "<span class='sectionSubtitle'>(adapted from <a target='_blank' href='https://www.foodallergy.org/document.doc?id=135'>The Food Allergy & Anaphylaxis Network's Guidelines for " +
                    "Managing Students with Food Allergies></a></span>"
            },
            {
                xtype: 'container',
                layout: {
                    type: 'table',
                    columns: 3,
                    tableAttrs: {
                        style: {
                            width: '100%'
                        },
                        cls: 'formContentTable'
                    },
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top',
                            'width': '32%',
                            'height': '100%'
                        }
                    }
                },
                defaults: {
                },
                items: [
                    {html: "<span class='tableListHeader'>Family's Responsibilities</span>"},
                    {html: "<span class='tableListHeader'>School's Responsibilities</span>"},
                    {html: "<span class='tableListHeader'>Student's Responsibilities</span>"},
                    {
                        html: "<ul class='tabledList'>" +
                            "  <li class='tabledListItem'>Notify the school of your child's allergies.</li>" +
                            "  <li class='tabledListItem'>Work with your child's teachers and Integrity Academy " +
                            "                             administration to develop a plan that accommodates your child's " +
                            "                             needs throughout the school including in the classroom, in " +
                            "                             the lunchroom, in after-school classes, and during school-sponsored " +
                            "                             activities.</li>" +
                            "  <li class='tabledListItem'>Provide written medical documentation, " +
                            "                             instructions, and medications as directed by a physician, using the " +
                            "                             Food Allergy Action Plan as a guide.  The guide can be found " +
                            "                             <a target='_blank' href='https://www.foodallergy.org/faap'>here</a>.</li>" +
                            "  <li class='tabledListItem'>Provide properly labeled medications and " +
                            "                             replace medications after use or upon expiration.</li>" +
                            "  <li class='tabledListItem'>Educate your child in the selfmanagement " +
                            "                             of their food allergy including safe/unsafe foods, strategies for avoiding " +
                            "                             exposure to unsafe foods, symptoms of allergic reactions, how and when to " +
                            "                             tell an adult they may be having an allergyrelated problem, and how to read " +
                            "                             food labels (age appropriate).</li>" +
                            "  <li class='tabledListItem'>Review policies/procedures with Integrity " +
                            "                             Academy staff, your child's physician, and your child after a reaction has occurred.</li>" +
                            "  <li class='tabledListItem'>Provide current emergency contact information.</li>" +
                            "</ul>"
                    },
                    {
                        html: "<ul class='tabledList'>" +
                            "  <li class='tabledListItem'>Review the health records submitted by parents and physicians.</li>" +
                            "  <li class='tabledListItem'>Work with families to establish a prevention/action plan.</li>" +
                            "  <li class='tabledListItem'>Assure that all staff who interact with the student " +
                            "                             on a regular basis understands the student's action plan for prevention and in the case of a reaction.</li>" +
                            "  <li class='tabledListItem'>Ensure the proper storage and accessibility of " +
                            "                             medications.</li>" +
                            "  <li class='tabledListItem'>Ensure that staff members are prepared to handle " +
                            "                            a reaction and are able to administer emergency medications during school hours.</li>" +
                            "  <li class='tabledListItem'>Review policies/procedures with families and the " +
                            "                             student's physician after a reaction has occurred.</li>" +
                            "  <li class='tabledListItem'>Have policies in place to minimize risk to " +
                            "                             food-allergic students (i.e.  ingredient cards, no trading food policy, and parent " +
                            "                             notification of food in classroom.)</li>" +
                            "</ul>"
                    },
                    {
                        html: "<ul class='tabledList'>" +
                            "  <li class='tabledListItem'>Refrain from trading food with other students.</li>" +
                            "  <li class='tabledListItem'>Refrain from eating anything with unknown " +
                            "                             ingredients or ingredients known to contain any allergen.</li>" +
                            "  <li class='tabledListItem'>Be proactive in the care and management of " +
                            "                             their food allergies and reactions based on their developmental level.</li>" +
                            "  <li class='tabledListItem'>Notify an adult immediately if they eat " +
                            "                             something they believe may contain the food to which they are allergic, " +
                            "                             or if they feel as though they are having allergy related symptoms.</li>" +
                            "</ul>"
                    }
                ]
            },

            {
                name: "Agreement",
                contentIsValue: true,
                html: "<span class='signatureInstructions'>By signing below I am indicating that I understand my responsibilities as outlined above.  " +
                    "I further understand that I am expected to work diligently to ensure that the staff, officers, agents, teachers, " +
                    "and representatives of the Khabele + Strong Incubator understand my child's food allergy and has the appropriate " +
                    "plan of action in place to minimize food-allergy related risks to my child. I hereby release the School from " +
                    "liability and shall indemnify and hold the School harmless for any injuries, accidents, or other harm that may " +
                    "result from my child's food allergy while in the care of the School.</span>"
            }
        ]
    },
    {
        collapsed: false,
        xtype: "textareafieldset",
        layout: "fit",
        align: "stretch",
        padding: 0,
        border: 0,
        name: "DoesthestudenthaveanyallergiestofoodwheatglutennutsetcPleaselistthem",
        allowBlank: false
    },
    {
        collapsed: false,
        xtype: "textareafieldset",
        layout: "fit",
        align: "stretch",
        padding: 0,
        border: 0,
        name: "DoesthestudenthaveanyallergiestomedicinesPleaselistthem",
        allowBlank: false
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
                fieldLabel: "Signature1",
                allowBlank: false
            },
            {
                xtype: "textfield",
                name: "Signature2",
                fieldLabel: "Signature2",
                allowBlank: true
            }
        ]
    }

]
