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
                name: "Whatareyourchildshobbiesandspecialinterests"
            },
            {
                name: "Pleasedescribeyourchildsacademicandsocialstrengths"
            },
            {
                name: "Inwhichareasbothacademicandsocialdoyoufeelthatyourchildcouldbenefitfromthemostguidance"
            },
            {
                name: "WhatareyourtopthreereasonsforchoosingalternativeeducationforChildhoodElementary"
            },
            {
                xtype: "bindablecheckboxgroup",
                columns: 3,
                name: "FamilyContributions",
                instructions: "Each family at Integrity Academy must fulfill at least 20 hours worth of " +
                    "volunteer work per year. Please check any of the following ways you can imagine your " +
                    "family contributing to our community",
                items: [
                    {name: "ContributableSkills", inputValue: "Fundraising", boxLabel: "Fundraising"},
                    {name: "ContributableSkills", inputValue: "Marketing", boxLabel: "Marketing"},
                    {name: "ContributableSkills", inputValue: "Event-Planning", boxLabel: "Event-Planning"},
                    {name: "ContributableSkills", inputValue: "Grant-Writing", boxLabel: "Grant-Writing"},
                    {name: "ContributableSkills", inputValue: "Construction", boxLabel: "Construction"},
                    {name: "ContributableSkills", inputValue: "Handy Work", boxLabel: "Handy Work"},
                    {name: "ContributableSkills", inputValue: "Office Help", boxLabel: "Office Help"},
                    {name: "ContributableSkills", inputValue: "Library Book Pick Up", boxLabel: "Library Book Pick Up"},
                    {name: "ContributableSkills", inputValue: "Supply Pick Up", boxLabel: "Supply Pick Up"},
                    {name: "ContributableSkills", inputValue: "Weekly lunch/recess duty", boxLabel: "Weekly lunch/recess duty"},
                    {name: "ContributableSkills", inputValue: "Room Parent", boxLabel: "Room Parent"},
                    {name: "ContributableSkills", inputValue: "Monday Set-Up", boxLabel: "Monday Set-Up"},
                    {name: "ContributableSkills", inputValue: "Thursday Clean-Up", boxLabel: "Thursday Clean-Up"},
                    {name: "ContributableSkills", inputValue: "Volunteer Coordinator", boxLabel: "Volunteer Coordinator"}
                ]
            },
            {
                name: "Arethereanyotherskillsortalentsyourfamilymaybeabletocontribute"
            }
        ]
    }
]