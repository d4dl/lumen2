Ext.define('Lumen.view.form.CreditCardForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.creditcardform',
    header: false,
    border: false,
    skipTraverse: true,
    constructor: function (config) {
        this.items = this.createItems();
        this.dockedItems = this.createDockedItems();
        Stripe.setPublishableKey(ExternalResources.stripePublicKey);
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
                    { xtype: 'component', flex: 1 }
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
    handleSubmit: function () {
        var self = this;
        if(this.amount == null) {
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
        } else if(this.getForm().isValid()) {
            self.queryById('paymentButton').disabled = true;
            this.loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg: "Processing your payment"});
            this.loadMask.show();
            var token = Stripe.createToken({
                number: this.query('[name=ccNumber]')[0].getValue(),
                cvc: this.query('[name=CVC]')[0].getValue(),
                exp_month: this.query('[name=ccExpireMonth]')[0].getValue(),
                exp_year: this.query('[name=ccExpireYear]')[0].getValue(),
                address_line1: this.query("[fieldLabel='Street']")[0].getValue(),
                address_line2: this.query("[fieldLabel='Street 2']")[0].getValue(),
                address_city: this.query("[fieldLabel='City']")[0].getValue(),
                address_state: this.query("[fieldLabel='State']")[0].getValue(),
                address_zip: this.query("[fieldLabel='Postal code']")[0].getValue(),
                address_country: this.query("[fieldLabel='Country']")[0].getValue()
            }, function (status, response) {
                self.loadMask.hide();
                self.stripeResponseHandler(status, response)
            });
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

    stripeResponseHandler: function (status, response) {
        if (response.error) {
            this.loadMask.hide();
            var popup = Ext.widget('window', {
                title: 'There was a problem processing your payment',
                modal: true,
                html: response.error.message,
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
        } else {
            var self = this;
            var params = {
                token: response.id,
                paymentType: self.paymentType,
                amount: self.amount,
                fee: self.fee,
                description: self.description
            };
            if(self.ChildId) {
                params.ChildId = self.ChildId;
            }
            if(self.OwnerId) {
                params.OwnerId = self.OwnerId;
            }
            if(self.debitScheduleId) {
                params.debitScheduleId = self.debitScheduleId;
            }
            if(self.debitScheduleTemplateId) {
                params.debitScheduleTemplateId = self.debitScheduleTemplateId;
            }
            if (!this.skipApplicationSave) {
                var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg: "Saving your application.  Please wait..."});
                var form = Lumen.getApplication().applicationForm;
                Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
                    form: form,
                    callback: function (application) {
                        params.applicationId = Lumen.getApplication().getApplicationId();
                        self.savePaymentInfo(params);
                    }
                });
            } else {
                self.savePaymentInfo(params);
            }
        }
    },
    savePaymentInfo: function (params) {
        var self = this;
        Ext.Ajax.request({
            url: Lumen.DATA_SERVICE_URL_ROOT + "/paymentService.php",
            params: {
                params: JSON.stringify(params)
            },
            method: "POST",
            context: this,
            failure: function (response) {
                self.loadMask.hide();
            },
            success: function (response, opts) {
                self.loadMask.hide();
                var chargeInfo = Ext.JSON.decode(response.responseText);
                if (chargeInfo.errorMessage) {
                    var popup = Ext.widget('window', {
                        title: 'We came across a problem.',
                        modal: true,
                        html: chargeInfo.errorMessage,
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
                    if(params.applicationId) {
                        Lumen.getApplication().getAdmissionApplicationStore().setCharges(chargeInfo.allCharges);
                    }
                    popup.show();
                    Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                        notifyParams: {
                            applicationId: params.applicationId || null,
                            emailTitle: Lumen.getApplication().getStudentApplicantName(),
                            subject: "Payment made for " + Lumen.getApplication().getStudentApplicantName(),
                            link: Lumen.APPLICATION_LINK,
                            templateURL: Lumen.URL_APPLICATION_FEE_RECEIPT,
                            notify: Lumen.username,
                            substitutions: {
                                "__AMOUNT__": "$" + (chargeInfo.currentAmount / 100).toFixed(2)
                            }
                        }
                    });
                }
            }
        });
    }
});