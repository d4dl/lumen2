Ext.define('Lumen.view.form.PaymentPlanForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.paymentplan',
    border: false,
    title: "Payment Plans",
    cls: 'paymentPlanForm',
    padding: 8,
    layout: {
        type: 'vbox'
    },
    buttons: [
        {
            type: "button",
            itemId: "saveDebitScheduleButton",
            text: "Save Plan",
            rolePermissions: {
                admin: "write",
                unauthorizedAction: "destroy"
            }
        },
        {

            type: "button",
            itemId: "sendEnrollmentButton",
            rolePermissions: {
                admin: "write",
                unauthorizedAction: "destroy"
            }
        }
    ],
    initComponent: function() {
        this.items = [
            {
                border: false,
                html: Lumen.I18N_LABELS.tuitionFeesInstructions
            },
            {
                xtype: "container",
                itemId: "planAdminControlBox",
                layout: {
                    type: 'vbox'
                },
//                style: {
//                    display: "none"
//                },
                rolePermissions: {
                    admin: "write",
                    unauthorizedAction: "destroy"
                },
                items: [
                    {
                        border: false,
                        html: "<p/><h3>Select a parent to load their current payment plan.  <br/>If they don't have one yet, a new one " +
                              "will be created for them from a template after you select the 'Save Plan' button at the bottom. </h3>",

                        height: "90"
                    }
                ]
            },
            {
                xtype: "container",
                itemId:"paymentPlanContainer",
                layout: {
                    type: 'hbox'
                }
            },
            {
                xtype: 'creditcardform',
                title: Lumen.i18n('Payment'),
                skipApplicationSave: true,
                paymentType: 'tuitionPaymentPlan',
                description: "Tuition Payment Plan Initialization",
                layout: 'anchor',
                skipTraverse: true,
                fee: "3%",
                defaults: {
                    anchor: '100%'
                }
            }
        ];
        this.callParent(arguments);
    },
    listeners: {
        afterrender: function() {
            Lumen.getApplication().getController("PaymentPlanController").fireEvent(Lumen.LOAD_PAYMENT_PLAN_TEMPLATES, {
                paymentPlanForm: this.down("#paymentPlanContainer"),
                creditCardForm: this.down("creditcardform"),
                planAdminControlBox: this.down("#planAdminControlBox"),
                saveDebitScheduleButton: this.down("#saveDebitScheduleButton"),
                sendEnrollmentButton: this.down("#sendEnrollmentButton")
            });
        }
    }

});