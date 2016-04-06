Ext.define('Lumen.view.form.CreditCardForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.creditcardform',
    header: false,
    border: false,
    skipTraverse: true,
    constructor: function (config) {
        this.items = this.createItems();
        this.dockedItems = this.createDockedItems();
        if (Stripe) {
            Stripe.setPublishableKey(ExternalResources.stripePublicKey);
        } else {
            Lumen.log("There is no stripe install!!");
        }
        this.callParent(arguments);
        this.addListener({
            submit: {
                fn: this.handleSubmit,
                scope: this
            },
            render: {
                fn: this.addProductListeners,
                scope: this
            }
        });
    },

    getOutputHtml: function () {
        return "";
    },
    /*
     4000000000000010	address_line1_check and address_zip_check will both fail.
     4000000000000028	address_line1_check will fail.
     4000000000000036	address_zip_check will fail.
     4000000000000101	cvc_check will fail.
     4000000000000341	Attaching this card to a Customer object will succeed, but attempts to charge the customer will fail.
     4000000000000002	Charges with this card will always be declined with a card_declined code.
     4000000000000069	Will be declined with an expired_card code.
     4000000000000119	Will be declined with a processing_error code.
     */
    createDockedItems: function () {
        var dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                defaults: {},
                items: [
                    {
                        text: Lumen.i18n('Process Payment', Lumen.PROMPT),
                        handler: this.handleSubmit,
                        itemId: 'paymentButton',
                        style: {
                            left: 0
                        },
                        scope: this
                    },
                    {xtype: 'component', flex: 1}
                ]
            }
        ]
        return dockedItems;
    },
    createItems: function () {
        var items = [];
        if (this.productItems) {
            items = this.productItems;
        }
        if (this.debitScheduleTemplate) {

        }
        items = [
            {
                xtype: "address",
                title: "Billing Address",
                border: true,
                collapsed: false,
                border: false,
                collapsible: false,
                baseItemIdentifier: "PaymentAddress"
            },
            {
                xtype: 'radiogroup',
                anchor: 'none',
                layout: {
                    autoFlex: false
                },
                defaults: {
                    name: 'ccType',
                    style: 'margin-right:15px'
                },
                items: [
                    {
                        inputValue: 'visa',
                        boxLabel: 'Visa'
                    },
                    {
                        inputValue: 'mastercard',
                        boxLabel: 'MasterCard'
                    },
                    {
                        inputValue: 'amex',
                        boxLabel: 'American Express'
                    },
                    {
                        inputValue: 'discover',
                        boxLabel: 'Discover'
                    }
                ]
            },
            {
                xtype: 'textfield',
                name: 'ccName',
                fieldLabel: 'Name On Card',
                allowBlank: false,
                maxWidth: 300,
                minLength: 2
            },
            {

                xtype: 'textfield',
                name: 'ccNumber',
                fieldLabel: 'Card Number',
                flex: 1,
                allowBlank: false,
                minLength: 15,
                maxLength: 16,
                maxWidth: 300,
                enforceMaxLength: true,
                maskRe: /\d/,
                validator: function (value) {
                    if (!Stripe.validateCardNumber(value)) {
                        return "The credit card you entered is not valid.  Check your card and try again."
                    } else {
                        return true;
                    }
                },
                listeners: {
                    change: {
                        fn: function (target) {
                            var cardType = Stripe.cardType(target.getValue());
                            var cardRadio = this.down("[boxLabel=" + cardType + "]");
                            if (cardRadio) {
                                cardRadio.setValue(true);
                            }
                        },
                        scope: this
                    }
                }
            },
            {
                name: 'CVC',
                xtype: 'textfield',
                maxLength: 4,
                minLength: 3,
                maxWidth: 160,
                fieldLabel: 'CVC',
                allowBlank: false,
                enforceMaxLength: true,
                enforceMinLength: true,
                validator: function (value) {
                    if (!Stripe.validateCVC(value)) {
                        return "Invalid CVC Number";
                    } else {
                        return true;
                    }
                }

            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'Expiration',
                labelWidth: 75,
                layout: 'hbox',
                maxWidth: 255,
                items: [
                    {
                        xtype: 'combobox',
                        name: 'ccExpireMonth',
                        displayField: 'name',
                        valueField: 'num',
                        queryMode: 'local',
                        emptyText: 'Month',
                        hideLabel: true,
                        margins: '0 6 0 0',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'num'],
                            data: (function () {
                                var data = [];
                                Ext.Array.forEach(Ext.Date.monthNames, function (name, i) {
                                    data[i] = {name: name, num: i + 1};
                                });
                                return data;
                            })()
                        }),
                        flex: 1,
                        allowBlank: false,
                        forceSelection: true
                    },
                    {
                        xtype: 'numberfield',
                        name: 'ccExpireYear',
                        hideLabel: true,
                        width: 75,
                        value: new Date().getFullYear(),
                        minValue: new Date().getFullYear(),
                        allowBlank: false
                    }
                ]
            }
        ];

        return items;
    },
    addProductListeners: function () {
        var self = this;
        var productChoices = self.query("checkbox");
        Ext.each(productChoices, function (productChoice) {
            if (productChoice.amount) {
                productChoice.on("change", function () {
                    var checkedChoices = self.query("[checked='true']");
                    var total = 0;
                    for (var i = 0; i < checkedChoices.length; i++) {
                        var choice = checkedChoices[i];
                        total += choice.amount;
                    }
                    self.queryById('paymentButton').setText(Lumen.i18n('Process Payment') + ": " + Ext.util.Format.currency(total / 100));
                })
            }

        });
    },
    getProductChoices: function () {
        var self = this;
        var productChoices = self.query("[checked='true']");
        var choiceInfo = {items: [], total: 0};
        for (var i = 0; i < productChoices.length; i++) {
            var choice = productChoices[i];
            choiceInfo.total += choice.amount;
            choiceInfo.items.push({
                amount: choice.amount,
                itemName: choice.name
            });
            if (choice.isQuickmitFee) {
                choiceInfo.items[productChoices.length - 1]['isQuickmitFee'] = true;
                var now = new Date();
                choiceInfo['QuickmitFeeForYear' + now.getFullYear()] = true;
            }
        }
    },

    handleSubmit: function () {
        var self = this;
        if (this.amount == null) {
            self.queryById('paymentButton').disabled = false;
            var popup = Ext.widget('window', {
                title: 'You must select an amount.',
                modal: true,
                html: "Please select an amount before continuing.",
                width: 350,
                height: 120,
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: 'Ok',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            });
            popup.show();
        } else if (this.getForm().isValid()) {
            self.queryById('paymentButton').disabled = true;
            self.processPayment()
        } else {
            var popup = Ext.widget('window', {
                title: 'Please complete the form',
                modal: true,
                html: "Some fields in your form need attention. Please correct the items in red.",
                width: 350,
                height: 120,
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: 'Ok',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            });
            popup.show();
        }
    },

    processPayment: function () {
        var self = this;
        self.loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg: "Processing.  Please wait..."});
        var creditCard = {
            number: this.query('[name=ccNumber]')[0].getValue(),
            cvc: this.query('[name=CVC]')[0].getValue(),
            expireMonth: this.query('[name=ccExpireMonth]')[0].getValue(),
            expireYear: this.query('[name=ccExpireYear]')[0].getValue(),
            address1: this.query("[fieldLabel='Street']")[0].getValue(),
            address2: this.query("[fieldLabel='Street 2']")[0].getValue(),
            city: this.query("[fieldLabel='City']")[0].getValue(),
            state: this.query("[fieldLabel='State']")[0].getValue(),
            zipCode: this.query("[fieldLabel='Postal code']")[0].getValue(),
            country: this.query("[fieldLabel='Country']")[0].getValue()
        }

        var charge = {
            paymentType: self.paymentType,
            creditCard: creditCard,
            amount: self.amount,
            usageFee: self.fee,
            description: self.description
        };
        charge.studentId = Lumen.applicantId
        if (self.OwnerId) {
            charge.payor = Lumen.getApplication().getUser();
        }
        if (self.debitScheduleId) {
            charge.debitScheduleId = self.debitScheduleId;
        }
        if (self.debitScheduleTemplateId) {
            charge.debitScheduleTemplateId = self.debitScheduleTemplateId;
        }
        if (!this.skipApplicationSave) {
            var form = Lumen.getApplication().applicationForm;
            Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
                form: form,
                callback: function (application) {
                    charge.documentSystemId = Lumen.getApplication().getApplicationId();
                    self.doPayment(charge);
                }
            });
        } else {
            self.doPayment(charge);
        }
    },

    doPayment: function (charge) {
        var self = this;
        self.loadMask.show();
        Ext.Ajax.request({
            url: Lumen.DATA_SERVICE_URL_ROOT + "/paymentService.php",
            jsonData: charge,
            method: "POST",
            context: this,
            failure: function (response) {
                self.loadMask.hide();
                self.queryById('paymentButton').disabled = false;
            },
            success: function (response, opts) {
                self.loadMask.hide();
                var chargeInfo = Ext.JSON.decode(response.responseText);
                self.queryById('paymentButton').disabled = false;
                if (chargeInfo.failureMessage) {
                    var popup = Ext.widget('window', {
                        title: 'There was a problem processing your payment',
                        modal: true,
                        html: chargeInfo.failureMessage,
                        width: 350,
                        height: 320,
                        bodyStyle: 'padding: 10px 20px;',
                        autoScroll: true,

                        buttons: [
                            {
                                text: 'Ok',
                                handler: function () {
                                    this.up('window').close();
                                }
                            }
                        ]
                    });
                    popup.show();
                } else {
                    var popup = Ext.widget('window', {
                        title: 'Thank you.',
                        modal: true,
                        html: Lumen.I18N_LABELS.cardProcessedMessage,
                        bodyStyle: 'padding: 10px 20px;',
                        autoScroll: true,

                        buttons: [
                            {
                                text: 'Ok',
                                handler: function () {
                                    this.up('window').close();
                                    Lumen.getApplication().fireEvent("ADMISSION_APPLICATION_FEE_PAID")
                                }
                            }
                        ]
                    });
                    if (Lumen.getApplication().getApplicationId()) {
                        Lumen.getApplication().getAdmissionApplicationStore().setAmountPaid(self.amount);
                    }
                    popup.show();
                    Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                        notifyParams: {
                            applicationId: Lumen.getApplication().getApplicationId() || null,
                            notificationType: "applicationPayment",
                            amount: (self.amount).toFixed(2),
                            emailTitle: Lumen.getApplication().getStudentApplicantName(),
                            subject: "Payment made for " + Lumen.getApplication().getStudentApplicantName(),
                            link: Lumen.APPLICATION_LINK,
                            templateURL: Lumen.URL_APPLICATION_FEE_RECEIPT,
                            notify: Lumen.username,
                            substitutions: {
                                "__AMOUNT__": "$" + (self.amount).toFixed(2)
                            }
                        }
                    });
                }
            }
        });
    }
});