    [
    {
        xtype: "panel",
        layout: {
            type: "table",
            columns: 2,
            tdAttrs: {
                cls: "sectionTableCell"
            },
            trAttrs: {
                cls: "sectionTableRow"
            },
            tableAttrs: {
                cls: "sectionTable"
            }
        },
        defaults: {
            flex: 1,
            autoHeight: true
        },
        items: [
            {//TD
                layout: 'vbox',
                xtype: 'container',
                items: [
                    {
                        xtype: 'label',
                        cls: 'sectionTableDescription',
                        html: 'Primary (3-5 years)'
                    },
                    {
                        xtype: 'radio',
                        fieldCls: 'compactRadio',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[0].TuitionOptionTypeId",
                        boxLabel: 'Half-Day 8:15 a.m.-12:30 p.m.',
                        inputValue: 5
                    },
                    {
                        xtype: 'radio',
                        fieldCls: 'compactRadio',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[0].TuitionOptionTypeId",
                        boxLabel: 'Full-Day 8:15 a.m.-3:00 p.m.',
                        inputValue: 6
                    }
                ]
            },
            {//TD
                layout: 'vbox',
                xtype: 'container',
                items: [
                    {
                        xtype: 'label',
                        cls: 'sectionTableDescription',
                        html: 'Preschool - Primary (3yrs - 11yrs old)'
                    },
                    {
                        xtype: 'hidden',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[0].OptionSpecifier",
                        value: "tuition"
                    },
                    {
                        xtype: 'radio',
                        fieldCls: 'compactRadio',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[0].TuitionOptionTypeId",
                        boxLabel: '9:00-3:00 p.m.',
                        inputValue: 7
                    }
                ]
            },
            {//TD
                layout: 'vbox',
                xtype: 'container',
                items: [
                    {
                        xtype: 'label',
                        cls: 'sectionTableDescription',
                        html: 'Additional Programs'
                    },
                    {
                        xtype: 'hidden',
                        name: "TuitionOptionArray[1].OptionSpecifier",
                        value: "additional"
                    },
                    {
                        xtype: 'checkbox',
                        fieldCls: 'compactRadio',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[1].TuitionOptionTypeId",
                        boxLabel: 'After School 3:00-6:00 p.m.',
                        inputValue: 1
                    },
                    {
                        xtype: 'hidden',
                        name: "TuitionOptionArray[2].OptionSpecifier",
                        value: "additional"
                    },
                    {
                        xtype: 'checkbox',
                        fieldCls: 'compactRadio',
                        boxLabelCls: 'compactLabel',
                        name: "TuitionOptionArray[2].TuitionOptionTypeId",
                        boxLabel: 'Early Arrival 7:00-9:00 a.m.',
                        inputValue: 2
                    }
                ]
            }
        ]
    }
]