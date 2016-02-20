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
                xtype: "multianswerquestion",
                columns: 2,
                name: "Recordofpreviousschooling",
                defaults: {
                    xtype: "textfield"
                },
                subquestions: [
                    {
                        name: "NameofSchool",
                        fieldCls: 'leftInput'
                    },
                    {name: "GradesAttended",
                        fieldCls: 'rightInput'},
                    {name: "NameofSchool",
                        fieldCls: 'leftInput'},
                    {name: "GradesAttended",
                        fieldCls: 'rightInput'},
                    {name: "NameofSchool",
                        fieldCls: 'leftInput'},
                    {name: "GradesAttended",
                        fieldCls: 'rightInput'},
                    {name: "NameofSchool",
                        fieldCls: 'leftInput'},
                    {name: "GradesAttended",
                        fieldCls: 'rightInput'}
                ]
            },
            {
                name: "Inwhichclassesdoesyourchildexcel"
            },
            {
                name: "IsyourchildcurrentlyfailinganyclassesIfsowhatseemstobeholdinghimherback"
            },
            {
                name: "DescribeanyeducationalaccommodationsyourchildhashadinthepastormayrequireatOUR_SCHOOL"
            },
            {
                name: "HasyourchildeverbeensuspendedorexpelledfromaschoolIfsopleaseexplain"
            },
            {
                name: "Hasyourchildconsultedwithaprofessionalforeducationalorpsychologicaltestingcounselingguidanceorpsychotherapyinthepast3yearsIfsopleaseexplain"
            },
            {
                name: "HasyourchildhadanyissueswithdrugsoralcoholIfyespleaseexplain"
            }
        ]
    }
]