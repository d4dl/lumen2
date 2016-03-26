Ext.define('Lumen.controller.PaymentPlanController', {
    extend: 'Ext.app.Controller',
    views: ["form.PaymentPlanForm"],
    stores: ['DebitSchedule', 'DebitScheduleTemplate'],
    paymentPlanForms: [],
    init: function (application) {
        this.on({
            "LOAD_PAYMENT_PLAN_TEMPLATES": function (args, opts) {
                this.loadPaymentPlanForm(args.paymentPlanForm, args.creditCardForm, args.saveDebitScheduleButton, args.sendEnrollmentButton, args.planAdminControlBox)
            }
        });
        this.enrollmentButtonPrefix = "Present Final Enrollment to ";
    },

    loadPaymentPlanForm: function (paymentPlanFormContainer, creditCardForm, saveDebitScheduleButton, sendEnrollmentButton, planAdminControlBox) {
        if (Lumen.getApplication().userIsAdmin()) {
            var paymentPlanOwnerSelector = this.addPaymentPlanOwnerSelector(sendEnrollmentButton, paymentPlanFormContainer, creditCardForm, planAdminControlBox);
        }

        var scheduleStore = this.getDebitScheduleStore();
        if (!this.nonAdminScheduleStoreListener) {
            this.loadSchedules(paymentPlanFormContainer, paymentPlanOwnerSelector, creditCardForm);
        }
        this.nonAdminScheduleStoreListener = scheduleStore.on("datachanged", function () {
            this.loadSchedules(paymentPlanFormContainer, paymentPlanOwnerSelector, creditCardForm);
        }, this, {destroyable: true});

        this.addButtonListeners(paymentPlanFormContainer, saveDebitScheduleButton, sendEnrollmentButton, paymentPlanOwnerSelector);
    },

    loadSchedules: function (paymentPlanFormContainer, paymentPlanOwnerSelector, creditCardForm) {
        var scheduleStore = this.getDebitScheduleStore();
        if (this.nonAdminScheduleStoreListener) {
            this.nonAdminScheduleStoreListener.destroy();//enclose any previously defined listeners and destroy it before assigning the about to be created one.
        }
        if (scheduleStore.getCount() == 0) {
            console.log("----Empty schedule store found copying templates");
            this.copyScheduleTemplatesToScheduleStore();
        }

        this.bindScheduleStoreToForms(paymentPlanFormContainer, paymentPlanOwnerSelector, creditCardForm);
    },

    bindScheduleStoreToForms: function (paymentPlanFormContainer, paymentPlanOwnerSelector, creditCardForm) {
        var scheduleStore = this.getDebitScheduleStore();
        var self = this;
        var isAdmin = Lumen.getApplication().userIsAdmin();
        var radioGroup = [];
        //First destroy any previous payment plan forms.
        for (var i = 0; i < self.paymentPlanForms.length; i++) {
            self.paymentPlanForms[i].destroy();
        }
        self.paymentPlanForms = [];
        var applicantStore = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
        creditCardForm.OwnerId = (isAdmin && paymentPlanOwnerSelector) ? paymentPlanOwnerSelector.getValue() : Lumen.getApplication().getUserId();
        var activeDebitSchedules = scheduleStore.query("active", true);
        if (activeDebitSchedules && activeDebitSchedules.first()) {
            activeDebitSchedules.each(function (debitScheduleModel, index) {
                self.addDebitSchedule(debitScheduleModel, isAdmin, paymentPlanFormContainer, scheduleStore, creditCardForm);
            });
            creditCardForm.destroy();
            //If they're an admin, only show the form if they've selected an owner.

        } else if (!isAdmin || creditCardForm.OwnerId) {
            scheduleStore.each(function (debitScheduleModel, index) {
                self.addDebitSchedule(debitScheduleModel, isAdmin, paymentPlanFormContainer, scheduleStore, creditCardForm, radioGroup);
            });
        }
    },

    createPaymentPlanSummaryTitle: function (debitSchedule) {
        var totalDue = debitSchedule.get("totalDue");

        var today = new Date();
        if (totalDue === "") {
            totalDue = null;
        }
        var totalCalculated = debitSchedule.get("downPaymentAmount") || 0;
        var totalPaid = 0;
        debitSchedule.fees().each(function (feeModel, index) {
            var amount = feeModel.get('amount') || 0;
            totalCalculated += amount;
        });
        var nextPaymentAmount = 0;
        //This totalToBeCurrent stuff is busted.
        var totalToBeCurrent = totalCalculated;
        debitSchedule.debitEntries().each(function (entryModel, index) {
            var debitAmount = entryModel.get("debitAmount") || 0;
            var executedDate = entryModel.get("executedDate");
            var dateToExecute = entryModel.get("dateToExecute");
            //if(dateToExecute) {
            totalCalculated += debitAmount;
            //}
            var alreadyPaid = false;

            if (executedDate) {
                totalPaid += debitAmount;
                totalToBeCurrent = totalToBeCurrent - debitAmount;
                alreadyPaid = true;
            }

            if (!alreadyPaid && (dateToExecute && dateToExecute < today)) {
                totalToBeCurrent += debitAmount;
                nextPaymentAmount += debitAmount;
            }
        });

        var totalDueText = Ext.util.Format.currency(totalDue);
        var nextPaymentAmountText = Ext.util.Format.currency(nextPaymentAmount);
        var totalCalculatedText = Ext.util.Format.currency(totalCalculated);
        var totalPaidText = Ext.util.Format.currency(totalPaid);
        var totalToBeCurrentText = Ext.util.Format.currency(totalToBeCurrent);

        var title = "Active Payment Plan: " + (totalDue == null ? totalCalculatedText : totalDueText) + "<br/>Total Paid to date: " + totalPaidText;
        if (totalDue != null && totalDue != totalCalculated) {
            title += "<br/>Plan total: " + totalDueText + " is different from the planned payment <br/>amounts totalling: " +
                totalCalculatedText + ".  <br/>Adjust the payment amounts.";
        }
        if (nextPaymentAmountText) {
            //title += "<br/>A payment of " + totalToBeCurrentText + " will bring this account current.";
            title += "<br/>" + nextPaymentAmountText + " is scheduled to be debited from their <br/> credit card or checking account.";
        } else {
            title += "<br/>" + "This account is current."
        }
        //TODO this all needs to be fixed.
        return title;
    },

    addDebitScheduleEntryView: function (isAdmin, entryModel, debitScheduleModel, scheduleCount, templateView) {
        var scheduleStore = this.getDebitScheduleStore();
        var newModel = entryModel == null;
        if (newModel) {
            var scheduleEntries = debitScheduleModel.debitEntries();
            //entryModel = new Lumen.model.DebitScheduleEntry();
            entryModel = scheduleEntries.add({
                cls: "debitEntry",
                readOnly: !isAdmin,
                name: "debitEntries[" + scheduleCount + "]"
            })[0];
            entryModel.commit();
            //debitScheduleModel.associations.add("debitEntries", scheduleEntries);
        }
        var entryView = new Lumen.view.finance.DebitScheduleEntry({
            cls: !!entryModel.raw.executedDate ? "paidDebitEntry" : "debitEntry",
            readOnly: !isAdmin || !!entryModel.raw.executedDate,
            name: "debitEntries[" + scheduleCount + "]"
        });
        if (entryModel.raw.executedDate) {
            entryView.showPaidDate();
        }
        templateView.add(entryView);
        if (newModel) {
            Lumen.getApplication().fireEvent(Lumen.BIND_FORM_FIELDS, {formRoot: entryView, data: entryModel.raw});
        }
    },

    addDebitSchedule: function (debitScheduleModel, isAdmin, paymentPlanFormContainer, scheduleStore, creditCardForm, radioGroup) {
        var boundData = debitScheduleModel.raw;
        var self = this;
        //boundData.applicationId = applicationId;
        var debitSchedule = debitScheduleModel;
        var totalDue = debitSchedule.get("downPaymentAmount") || 0;
        var paymentPlanForm = new Ext.form.Panel({
            layout: {
                type: "vbox"
            },
            cls: "paymentPlanForm",
            exclusiveTopPanel: true,
            border: false
        });
        self.paymentPlanForms.push(paymentPlanForm);

        var title = "Payment Plan";
        var addEntryButton = null;
        /**
        if (isAdmin && debitSchedule.get("active")) {
            if (radioGroup) {
                title = "Payment Plan Template";
            } else {
                // title = !radioGroup ? self.createPaymentPlanSummaryTitle(debitSchedule) : "Payment Plan Template";
                title = "Active Payment Plan";
                var addEntryButton = Ext.create("Ext.button.Button", {
                    itemId: "addEntryButton",
                    text: Lumen.i18n("Add a Payment Entry"),
                    handler: function () {
                        self.addDebitScheduleEntryView(isAdmin, null, debitScheduleModel, debitSchedule.debitEntries().getCount(), templateView);
                    }
                });
            }
        };
         **/
        paymentPlanForm.setTitle(title);

        console.log("Loading template " + debitSchedule.name);
        var templateView = new Lumen.view.finance.DebitSchedule({
            title: debitSchedule.name,
            readOnly: !isAdmin,
            border: false,
            trackResetOnLoad: true
        });

        debitSchedule.fees().each(function (feeModel, index) {
            var amount = feeModel.get('amount');
            if (amount > 0 || isAdmin) {
                totalDue += amount;
                var feeView = new Lumen.view.finance.Fee({
                    readOnly: !isAdmin,
                    name: "fees[" + index + "]"
                });
                templateView.add(feeView);
            }
        });

        debitSchedule.debitEntries().each(function (entryModel, index) {
            var debitAmount = entryModel.get("debitAmount");
            if (debitAmount > 0) {
                self.addDebitScheduleEntryView(isAdmin, entryModel, null, index, templateView);
            }
        });
        paymentPlanForm.add(templateView);
        paymentPlanFormContainer.add(paymentPlanForm);
        if (addEntryButton) {
            paymentPlanForm.add(addEntryButton);
        }


        var totalDueBox = Ext.create("Ext.Component", {
            border: false,
            html: "<div><span class='totalDueLabel'></span>"
        });
        paymentPlanForm.add(totalDueBox);
        if (radioGroup && !isAdmin) {
            //This button needs to be disabled for admins and ignored unless a payment plan is being setup
            var planSelectionButton = new Ext.form.field.Radio({
                name: "active",
                boxLabelCls: 'selectedPaymentPlanLabel',
                boxLabel: "Choose this plan and pay ",
                debitScheduleName: debitSchedule.get("name"),
                listeners: {
                    change: function (radio, newValue, oldValue, eOpts) {
                        if (newValue === true) {
                            scheduleStore.each(function (nextSchedule) {
                                if (nextSchedule.get("name") == radio.debitScheduleName) {
                                    if (debitSchedule.raw['_id']) {
                                        creditCardForm.debitScheduleId = debitSchedule.raw['_id']['$id'];
                                    } else if (debitSchedule.raw.debitScheduleTemplateId) {
                                        creditCardForm.debitScheduleTemplateId = debitSchedule.raw.debitScheduleTemplateId;
                                    }
                                    creditCardForm.amount = totalDue * 100;
                                    creditCardForm.description = radio.debitScheduleName;
                                } else {
                                    nextSchedule.raw.active = false;
                                }
                            });
                            for (var i = 0; i < radioGroup.length; i++) {
                                var otherRadio = radioGroup[i];
                                if (otherRadio != radio) {
                                    otherRadio.setValue(false);
                                }
                            }
                        }
                    }
                }
            });
            //            if(!debitSchedule.raw['_id']) {
            //                planSelectionButton.disable();
            //            }
            self.setTotalsText(totalDueBox, planSelectionButton, debitSchedule);
            paymentPlanForm.add(planSelectionButton);
            radioGroup.push(planSelectionButton);
        }
        Ext.each(paymentPlanForm.query("field"), function (field) {
            field.on("change", Ext.Function.createDelayed(function () {
                self.setTotalsText(totalDueBox, planSelectionButton, debitSchedule);
            }), 200);//There are other listeners that change the field's bound data that need to change it before a recalculation occurs.
        });
        Lumen.getApplication().fireEvent(Lumen.BIND_FORM_FIELDS, {formRoot: paymentPlanForm, data: boundData});
    },

    setTotalsText: function (totalDueBox, radioButton, debitSchedule) {
        if (totalDueBox.getEl()) {
            var self = this;
            var debitScheduleData = debitSchedule.raw;
            var totalDue = debitScheduleData.downPaymentAmount || 0;

            Ext.each(debitScheduleData.fees, function (fee, index) {
                var amount = fee.amount;
                if (amount) {
                    totalDue += amount;
                }
            });

            var totalCost = totalDue;
            Ext.each(debitScheduleData.debitEntries, function (entry, index) {
                var debitAmount = entry.debitAmount;
                if (debitAmount) {
                    totalCost += debitAmount;
                }
            });

            if (radioButton) {
                var totalDueText = Ext.util.Format.currency(totalDue);
                var totalCostText = Ext.util.Format.currency(totalCost);
                var html = "<div><span class='totalDueLabel'>Total Due Now:</span>" + "<span class='totalDueAmount'>" + totalDueText + "</span></div>";
                totalDueBox.getEl().setHTML(html);
                radioButton.setBoxLabel("Choose this plan and pay " + totalDueText + " now<br/>(total cost: " + totalCostText + ")");
            }
        }
    },

    copyScheduleTemplatesToScheduleStore: function (newScheduleTemplates) {
        var scheduleStore = this.getDebitScheduleStore();
        var self = this;

        if (scheduleStore.getCount() == 0) {
            var scheduleStore = this.getDebitScheduleStore();
            var scheduleTemplateStore = this.getDebitScheduleTemplateStore();
            if (newScheduleTemplates && newScheduleTemplates.length > 0) {
                Ext.each(newScheduleTemplates, function (debitScheduleTemplate, index) {
                    self.copyDebitScheduleTemplateToScheduleStore(debitScheduleTemplate, scheduleStore);
                });
            } else {
                scheduleTemplateStore.each(function (debitScheduleTemplateModel, index) {
                    self.copyDebitScheduleTemplateToScheduleStore(debitScheduleTemplateModel.raw, scheduleStore);
                });
            }
        }
    },

    copyDebitScheduleTemplateToScheduleStore: function (debitScheduleTemplate, scheduleStore) {
        var debitScheduleData = Ext.clone(debitScheduleTemplate);
        if (debitScheduleData["_id"]) {
            debitScheduleData.debitScheduleTemplateId = debitScheduleData["_id"]["$id"];
            delete debitScheduleData["_id"];
        }
        scheduleStore.loadRawData(debitScheduleData, true);
    },

    addPaymentPlanOwnerSelector: function (sendEnrollmentButton, paymentPlanFormContainer, creditCardForm, planAdminControlBox) {
        var self = this;
        var paymentPlanOwnerSelector = Ext.create("Ext.form.field.ComboBox", {
            itemId: "paymentPlanOwnerSelector",
            fieldLabel: Lumen.i18n("Payment plan owner"),
            emptyText: Lumen.i18n('Select a parent...'),
            valueField: "OwnerId",
            displayField: "OwnerName",
            multiSelect: false,
            height: "90"
        })
        planAdminControlBox.add(paymentPlanOwnerSelector);
        var applicantStore = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
        var ownerIdData = [];
        if (!self.applicantStoreListener) {
            this.populatePaymentPlanSelector(ownerIdData);
        } else {
            self.applicantStoreListener.destroy();
        }
        self.applicantStoreListener = applicantStore.on("datachanged", function () {
            this.populatePaymentPlanSelector(ownerIdData);
        }, self, {destroyable: true});
        //paymentPlanOwnerSelector.data = ownerIdData;
        var parentStore = Ext.create('Ext.data.Store', {
            fields: ['OwnerId', 'OwnerName'],
            data: ownerIdData
        });
        paymentPlanOwnerSelector.bindStore(parentStore);
        paymentPlanOwnerSelector.on("change", function (selector, newValue, oldValue, eOpts) {
            var allFormsClean = true;
            //Disabling this check for now.
//            for(var i=0; i < self.paymentPlanForms.length; i++) {
//                if(self.paymentPlanForms[i].isDirty()) {
//                    allFormsClean = false;
//                    break;
//                }
//            }
            if (allFormsClean) {
                self.switchToSelectedUser(sendEnrollmentButton, selector, paymentPlanFormContainer, creditCardForm);
            } else {
                var popup = Ext.widget('window', {
                    title: 'Payment plan changes not saved',
                    modal: true,
                    html: "You've made changes but haven't saved them.  Click 'Cancel', then save your changes or click 'Discard' to discard your unsaved changes.",
                    bodyStyle: 'padding: 10px 20px;',
                    autoScroll: true,

                    buttons: [
                        {
                            text: Lumen.i18n('Cancel'),
                            handler: function () {
                                popup.close();
                            }
                        },
                        {
                            text: Lumen.i18n('Discard'),
                            handler: function () {
                                self.switchToSelectedUser(sendEnrollmentButton, selector, paymentPlanFormContainer, creditCardForm);
                                popup.close();
                            }
                        }
                    ]
                });
                popup.show();
            }
        });
        return paymentPlanOwnerSelector;
    },

    populatePaymentPlanSelector: function (ownerIdData) {
        var applicantStore = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
        this.childId = applicantStore.first().getId();
        applicantStore.each(function (debitScheduleModel, index) {
            var guardians = debitScheduleModel.raw.guardianList;
            for (var i = 0; i < guardians.length; i++) {
                var person = guardians[i].guardian
                var name = person.firstName + " " + person.LastName;
                ownerIdData.push({OwnerId: person.id, OwnerName: name});
            }
            //debitScheduleModel.set(.applicationId = Lumen.getApplication().getApplicationId();
        });
    },

    switchToSelectedUser: function (sendEnrollmentButton, selector, paymentPlanFormContainer, creditCardForm) {
        var self = this;
        sendEnrollmentButton.setText(self.enrollmentButtonPrefix + selector.getDisplayValue());
        var debitScheduleStore = self.getDebitScheduleStore();
        var newScheduleTemplates = [];//Will act as templates if no schedules end up being loaded.
        if (debitScheduleStore.getCount() > 0) {
            //Save off the current schedules because its most likely
            //that whoever is editing these will want the edits to remain
            //in the event that the 'about to be loaded' store ends up empty
            //and tempalates are going to be used to populate the store.
            debitScheduleStore.each(function (debitSchedule, index) {
                var newScheduleTemplate = Ext.clone(debitSchedule.raw);
                newScheduleTemplates.push(newScheduleTemplate);
            });
        }
        debitScheduleStore.load({
            params: {
                documentType: "DebitSchedule",
                method: "POST",
                action: "find",
                criteria: JSON.stringify([
                    {
                        name: "payor",
                        value: selector.getValue(),
                        conjunction: "and"
                    },
                    {
                        name: "student",
                        value: self.childId,
                        conjunction: "and"
                    }
                ]),
            }, callback: function () {
                if (debitScheduleStore.getCount() == 0) {
                    self.copyScheduleTemplatesToScheduleStore(newScheduleTemplates);
                }

                //self.markFormsClean();
                self.bindScheduleStoreToForms(paymentPlanFormContainer, selector, creditCardForm);
            }
        });
    },

    addButtonListeners: function (paymentPlanFormContainer, saveDebitScheduleButton, sendEnrollmentButton, paymentPlanOwnerSelector) {
        var self = this;
        sendEnrollmentButton.setText(self.enrollmentButtonPrefix + "...");
        sendEnrollmentButton.on({
            click: function () {
                self.showEnrollmentConfirmation(paymentPlanOwnerSelector);
            }
        });
        saveDebitScheduleButton.on({
            click: function () {
                self.savePaymentPlan(paymentPlanOwnerSelector.getValue());
                //self.markFormsClean();
            }
        });
        //        newTemplateButton.on({
        //            click: function(){
        //                self.showSaveTemplateConfirmation();
        //            }
        //        });
        //        newTemplateButton.on({
        //            click: function(){
        //                self.showSaveSchedulesConfirmation();
        //            }
        //        });
        //        paymentPlanFormContainer.doLayout();
    },

    savePaymentPlan: function (ownerId) {
        var self = this;
        var scheduleStore = self.getDebitScheduleStore();
        if (!ownerId) {
            var popup = this.forceParentSelection();
        } else {
            scheduleStore.each(function (debitSchedule, index) {
                //Crappy custom serialization.. again. ExtJS never fullfilled a nice promise of serialized JSON data
                //and I gotta eat
                debitSchedule.raw.OwnerId = ownerId;
                debitSchedule.raw.ChildId = self.childId;
                var jsonForm = Ext.apply({}, debitSchedule.raw);
                jsonForm.debitEntries = [];
                debitSchedule.debitEntries().each(function (entryModel, index) {
                    jsonForm.debitEntries.push(entryModel.raw);
                });
                self.saveJSONForm(jsonForm, "DebitSchedule");
            });
            var popup = Ext.widget('window', {
                title: 'Payment plan saved',
                modal: true,
                html: "The Payment Plan Was Saved",
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: Lumen.i18n('OK'),
                        handler: function () {
                            popup.close();
                        }
                    }
                ]
            });
        }
        popup.show();
    },

    markFormsClean: function () {
        var self = this;
        for (var i = 0; i < self.paymentPlanForms.length; i++) {
            var paymentPlanForm = self.paymentPlanForms[i].getForm();
            if (paymentPlanForm.isDirty()) {
                paymentPlanForm.setValues(paymentPlanForm.getValues());
            }
        }
    },

    //Save payment plan
    //Save Application status
    //Notify parent
    showEnrollmentConfirmation: function (paymentPlanOwnerSelector) {
        var self = this;
        var ownerId = paymentPlanOwnerSelector.getValue();
        var scheduleStore = self.getDebitScheduleStore();
        if (!ownerId) {
            var popup = this.forceParentSelection();
        } else {
            var popup = Ext.widget('window', {
                title: 'Confirm Enrollment',
                modal: true,
                html: Lumen.I18N_LABELS.confirmEnrollment,
                width: 750,
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: Lumen.i18n('Confirm'),
                        handler: function () {
                            Lumen.getApplication().updateApplicationStatus(null, "Enrolled");
                            scheduleStore.each(function (debitSchedule, index) {
                                debitSchedule.raw.OwnerId = ownerId;
                                debitSchedule.raw.ChildId = self.childId;
                                self.saveJSONForm(debitSchedule.raw, "DebitSchedule");
                            });
                            popup.close();
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: function () {
                            popup.close();
                        }
                    }
                ]
            });
        }
        popup.show();
    },


    forceParentSelection: function () {
        var popup = Ext.widget('window', {
            title: 'Choose a parent',
            modal: true,
            html: "You must select a parent to offer the payment plan to.",
            width: 750,
            bodyStyle: 'padding: 10px 20px;',
            autoScroll: true,

            buttons: [
                {
                    text: Lumen.i18n('OK'), handler: function () {
                    popup.close()
                }
                }
            ]
        })
        return popup;
    },

    saveJSONForm: function (documentData, documentType) {
        Lumen.getApplication().fireEvent(Lumen.SAVE_JSON_ENTITY, {
            document: Ext.encode(documentData),
            documentType: documentType || "JSONForm",
            callback: function (savedData) {
                if (savedData['_id']) {
                    documentData['_id'] = savedData['_id'];
                }
            }
        });
    },

    sendEnrollmentConfirmation: function () {
        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
            notifyParams: {
                //applicationId: Lumen.getApplication().getApplicationId(),
                emailTitle: Lumen.getApplication().getStudentApplicantName() + Lumen.i18n("Confirmation of Enrollment"),
                subject: Lumen.i18n("Confirmation of Enrollment"),
                link: Lumen.APPLICATION_LINK,
                templateURL: Lumen.URL_ENROLLMENT_CONFIRMATION,
                notify: Lumen.getApplication().getParentEmails(),
                substitutions: {
                    "__PARENT_FIRST_NAMES__": Lumen.getApplication().getParentFirstNames(),
                    "__STUDENT_FIRST_NAME__": Lumen.getApplication().getStudentApplicantFirstName()
                }
            }
        });
    }
});