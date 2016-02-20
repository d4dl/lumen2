[
    {
        xtype: 'creditcardform',
        title: Lumen.i18n('Growing Together'),
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [
            {
                xtype: 'bindablecheckboxgroup',
                items: [
                    {
                        boxLabel: Lumen.i18n("Enrollment Fee", Lumen.PROMPT),
                        name: 'enrollmentFee',
                        readOnly: 'true',
                        checked: 'true',
                        productAmount: 50000
                    },
                    {
                        boxLabel: Lumen.i18n("Supply Fee", Lumen.PROMPT),
                        name: 'supplyFee',
                        readOnly: 'true',
                        checked: 'true',
                        productAmount: 20000
                    },
                    {
                        boxLabel: Lumen.i18n("Processing Fee", Lumen.PROMPT),
                        name: 'mealFee',
                        readOnly: 'true',
                        checked: 'true',
                        isQuickmitFee: true,
                        fee: Lumen.QUICKMIT_STRIPE_APPLICATION_FEE ,//fees default to 3% if not specifid.
                        productAmount: 5000
                    },
                    {
                        boxLabel: Lumen.i18n("Daily Meals and Snacks Fee", Lumen.PROMPT),
                        name: 'mealFee',
                        readOnly: 'true',
                        checked: 'true',
                        productAmount: 28000
                    }
                ]
            }, {
                xtype: 'bindableradiogroup',
                items: [
                    {
                        boxLabel: Lumen.i18n("Plan A", Lumen.PROMPT),
                        instructions: Lumen.i18n("paymentPlanA", Lumen.PROMPT),
                        name: 'Plan A',
                        productAmount: 2800
                    },
                    {
                        boxLabel: Lumen.i18n("Plan B", Lumen.PROMPT),
                        instructions: Lumen.i18n("paymentPlanB", Lumen.PROMPT),
                        name: 'Plan A',
                        productAmountSchedule: {
                            "now": 720,
                            "May 5, 2015": 720,
                            "June 5, 2015": 720,
                            "July 5, 2015": 720
                        }
                    }
                ]
            }
        ]
    }

]