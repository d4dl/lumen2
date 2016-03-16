Ext.define('Lumen.view.JSONForm',{
    alias: "widget.jsonform",
    frame: true,
    autoHeight: true,
    cls: "jsonform",
    autoDestroy: true,

    //This is poorly named and not reusable.
    //Most of the code should be in Base Application.
    //Reusable code should be in JSONFormContainer and that should be used instead.
    constructor: function (config) {
        this.baseForm = this.down('form').getForm();

        Lumen.getApplication().applicationForm = this;
        this.baseForm.baseParams = {ApplicationType: config.applicationType};
        var listeners = Lumen.getApplication().addListener({
            destroyable: true,
            "ADMISSION_APPLICATION_FEE_PAID":{
                fn: function() {
                    var application = self.getComponent("application");
                    if (application) {
                        self.setActiveTab(application);
                    }
                    this.verifyCompleteness()
                },
                scope: this
            }
        });
        this.addListener({
            beforetabchange: {
                fn: function () {
                    var applicationNameField = this.down('#studentApplicantName');
                    if(applicationNameField) {
                        if(applicationNameField.isValid()) {
                            //this.submitApplication(false);
                        } else {
                            var popup = Ext.widget('window',{
                                title: 'Required Fields Missing.',
                                modal: true,
                                html: "Child Name is Required",
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
                            return false;
                        }
                    }
                },
                scope: this
            },
            afterrender: {
                fn: function () {
                    Lumen.getApplication().fireEvent(Lumen.LOAD_DOCUMENT_LIST,{formRoot: this});

                    if(Lumen.RENDER_FOR_PRINT || Lumen.getApplication().userIsAdmin()) {
                        var baseApplication = this.ownerCt;
                        var self = this;
                        var printableBases = this.ownerCt.el.select(".printableBase").each(function(printableBase) {
                            var buttonHtml = "<img class='printButton' width='32'  height='32' src="+ Lumen.IMAGES_URL_ROOT + "/icons/printer.png>";
                            var buttonElement = printableBase.createChild({html: buttonHtml});

                            buttonElement.addListener({click: function() {
                                //Lumen.getApplication().fireEvent(Lumen.EXPAND_EVERYTHING);
                                var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();
                                var application = admissionApplicationStore.first();
                                var applicationData = application.raw || application.data;

                                var applicationTabs = [new Lumen.controller.util.HtmlExtractor().extractApplicationHtml(self)];
                                var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg:"Please wait..."});
                                loadMask.show();

                                var body = Ext.getBody();
                                var url =  Lumen.DATA_SERVICE_URL_ROOT + "/printService.php";
                                var form = body.createChild({
                                    tag:'form',
                                    method: "post",
                                    action: url,
                                    target:'_blank'
                                });
                                for(var i=0; i < applicationTabs.length; i++) {
                                    form.createChild({
                                        tag:'input',
                                        type: 'hidden',
                                        name: "applicationSection[]",
                                        value: Ext.String.htmlEncode("<div>"+applicationTabs[i]+"</div>")
                                    });
                                }
                                form.dom.submit();


                                //This forces the download of an iframe for application/pdf content types.

//                                var frame = body.createChild({
//                                    tag:'iframe',
//                                    cls:'x-hidden',
//                                    id:'hiddenform-iframe',
//                                    name:'iframe'
//                                });
//
//                                var form = body.createChild({
//                                    tag:'form',
//                                    method: "post",
//                                    cls:'x-hidden',
//                                    id:'hiddenform-form',
//                                    action: url,
//                                    target:'iframe'
//                                });
//
//                                form.createChild({
//                                    tag:'input',
//                                    type: 'hidden',
//                                    name: "filename",
//                                        value: Ext.String.htmlEncode(applicationData.Child.firstName + "_" + applicationData.Child.lastName + ".pdf")
//                                });
                                loadMask.hide();
//
//                                Ext.Ajax.request({
//                                    url: Lumen.DATA_SERVICE_URL_ROOT + "printService.php",
//                                    params: {
//                                        applicationData: Ext.JSON.encode(htmlMessage),
//                                        filename: applicationData.Child.firstName + "_" + applicationData.Child.lastName + ".pdf"
//                                    },
//                                    method: "POST",
//                                    context: this,
//                                    failure: function (response) {
//                                        loadMask.hide();
//                                    },
//                                    success: function (response,opts) {
//                                        loadMask.hide();
//                                    }
//                                });
                            }})
                        }, this);
                    } else {
                        //this.relevantTabToFront();
                    }
                }
            },
            load: {
                fn: function () {
                    var baseForm = this.getForm();
                    baseForm.setValues(baseForm.getValues());
                }
            },
            validitychange: {
                fn: function () {
                    if (!this.hasInvalidField()) {
                        this.queryById("submitButton").setDisabled(false);
                    }
                }
            }
        });

        var self = this;
        window.onbeforeunload = function() {
            if(!Lumen.getApplication().userIsAdmin() && Lumen.getApplication().getStudentApplicantName()) {
                self.submitApplication(false);
            }
        };
    },

    addApplicationItems: function (config) {
        this.items = this.initializeItems(config);
        var applicationItem = this.items[0];

        applicationItem.items = !applicationItem.items ? config.applicationItems : applicationItem.items.concat(config.applicationItems);
        applicationItem.items.sort(function (a, b) {
            return a.insertIndex - b.insertIndex
        });
        for (var p = 0; p < config.applicationItems.length; p++) {
            if (config.applicationItems[p].fieldSetComponent) {
                applicationItem.items[p].fieldSetComponent = config.applicationItems[p].fieldSetComponent;
            }
        }
    },

    relevantTabToFront: function() {
        var paid = Lumen.getApplication().getAdmissionApplicationStore().applicationFeeIsPaid();
        var guestDaysComplete = Lumen.getApplication().getGuestDaysRequested();

        var self = this;
        if(this.showGuestDaysPanel) {
            //if(!Lumen.getApplication().getApplicationIsNew()) {
            setTimeout(function() {
                if(!guestDaysComplete) {
                    var guestDaysPanel = self.getComponent("guestDaysPanel");
                    if(guestDaysPanel) {
                        self.setActiveTab(guestDaysPanel);
                    }
                }
            }, 300);
            //else if(!paid) {
            //        this.setActiveTab(this.getComponent("applicationFeePanel"));
            //    }
            //}
        }
    },


    addGuestDaysPanel: function (items) {
        var self = this;
        var guestDaysPanel = {
            xtype: 'appformloader',
            title: "Day Visits",
            itemId: "guestDaysPanel",
            url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/GuestDays.js",
            createDockedItems: function () {
                var dockedItems = [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        ui: 'footer',
                        defaults: {},
                        items: [
                            {
                                text: 'Submit Request for Day Visits',
                                handler: function (button, event) {
                                    var skipValidation = new Lumen.controller.util.QueryData().get("skipValidation");

                                    var guestDaysPanel = button.up("[itemId=guestDaysPanel]");
                                    var domWalker = new Lumen.controller.util.DomWalker();
                                    var htmlMessage = domWalker.buildFieldSetComponentHtml(guestDaysPanel, skipValidation);
                                    //Don't do this.
                                    ///self.submitApplication(false)
                                    if (htmlMessage) {
                                        Lumen.getApplication().setGuestDaysRequested(true, {
                                            form: {
                                                url: Lumen.DATA_SERVICE_URL_ROOT + '/updateApplication.php',
                                                baseParams: self.down('form').getForm().baseParams
                                            }
                                        });
                                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                                            notifyParams: {
                                                applicationId: Lumen.getApplication().getApplicationId(),
                                                emailTitle: Lumen.getApplication().getStudentApplicantName(),
                                                subject: "Request for Day Visits for " + Lumen.getApplication().getStudentApplicantName(),
                                                link: Lumen.APPLICATION_LINK,
                                                templateURL: Lumen.URL_ADMIN_GUEST_DAYS_NOTIFICATION,
                                                emailTo: "coordinator",
                                                message: htmlMessage
                                            }
                                        });
                                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                                            notifyParams: {
                                                applicationId: Lumen.getApplication().getApplicationId(),
                                                emailTitle: Lumen.getApplication().getStudentApplicantName(),
                                                subject: "Request for " + Lumen.I18N_LABELS.guestDaysName + " for " + Lumen.getApplication().getStudentApplicantName(),
                                                link: Lumen.APPLICATION_LINK,
                                                templateURL: Lumen.URL_GUEST_DAYS_REQUEST_RECEIVED,
                                                notify: Lumen.username,
                                                //date: date, date date
                                                message: htmlMessage,
                                                substitutions: {
                                                    "__STUDENT_NAME__": Lumen.getApplication().getStudentApplicantName(),
                                                    "__DATE_1__": Ext.Date.format(guestDaysPanel.down("#guestDayDay1").getValue(), 'F j, Y'),
                                                    "__DATE_2__": Ext.Date.format(guestDaysPanel.down("#guestDayDay2").getValue(), 'F j, Y'),
                                                    "__DATE_3__": Ext.Date.format(guestDaysPanel.down("#guestDayDay3").getValue(), 'F j, Y')
                                                }
                                            }
                                        });


                                        var popup = Ext.widget('window', {
                                            title: 'Request submitted.',
                                            modal: true,
                                            html: Lumen.I18N_LABELS.guestDaysSubmittedInstructions,
                                            width: 750,
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
                                            title: 'Some items in the form are not complete.',
                                            modal: true,
                                            html: Lumen.I18N_LABELS.needMoreGuestDaysInfo,
                                            width: 350,
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
            }
        }
        items.push(guestDaysPanel);
    },

    getRenderedLayoutName: function() {
        return Lumen.RENDER_FOR_PRINT ? "vbox" : "lumen.accordionstretch";
    },

    submitApplication: function (applicationSubmitted) {
        //The button's toolbar's
        var self = this;
        var childForm = this.down('form');
        var form = childForm.getForm();
        if (form) {
            Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
                form: form,
                applicationSubmitted: applicationSubmitted,
                callback: function (response) {
                    if (response.isNewApp) {
                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                            notifyParams: {
                                applicationId: Lumen.getApplication().getApplicationId(),
                                emailTitle: Lumen.I18N_LABELS.newApplicationEmailTitle,
                                subject: Lumen.I18N_LABELS.newApplicationEmailSubject,
                                link: Lumen.APPLICATION_LINK,
                                templateURL: Lumen.URL_ADMISSION_WELCOME,
                                notify: Lumen.username
                            }
                        });
                    }
                    if (applicationSubmitted) {
                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                            notifyParams: {
                                applicationId: Lumen.getApplication().getApplicationId(),
                                emailTo: "coordinator",
                                emailTitle: Lumen.I18N_LABELS.applicationCompleteEmailCoordinatorTitle,
                                subject: Lumen.I18N_LABELS.applicationCompleteEmailCoordinatorSubject,
                                link: Lumen.APPLICATION_LINK,
                                templateURL: Lumen.URL_ADMISSION_NOTIFICATION,
                                message: new Lumen.controller.util.HtmlExtractor().extractApplicationHtml(self)
                            }
                        });
                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                            notifyParams: {
                                applicationId: Lumen.getApplication().getApplicationId(),
                                emailTitle: Lumen.I18N_LABELS.applicationCompleteEmailApplicantEmailTitle,
                                subject: Lumen.I18N_LABELS.applicationCompleteEmailApplicantEmailSubject,
                                link: Lumen.APPLICATION_LINK,
                                templateURL: Lumen.URL_APPLICATION_RECEIVED,
                                notify: Lumen.username
                            }
                        });
                        self.relevantTabToFront();
                        var popup = Ext.widget('window', {
                            title: 'Thank you for your submission.',
                            modal: true,
                            html: Lumen.I18N_LABELS.applicationWasSubmittedInstructions,
                            width: 350,
                            height: 220,
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
                }
            });
        }
    },

    verifyCompleteness: function () {
        var self = this;
        self.debugId = Math.random() * 1000000;
        Lumen.log("Created debug id " + self.debugId);
        var downForm = self.down('form');
        if(!downForm) {
            return;
        }
        var form = downForm.getForm();
        form.isValid();
        var fields = form.getFields().items;

        var requiredFieldMap = self.findInvalidFields(fields);
        self.updateInvalidContainers(requiredFieldMap);
        if (requiredFieldMap.totals.totalRequired == requiredFieldMap.totals.totalComplete) {
            var popup = Ext.widget('window', {
                title: 'Your application is complete.',
                modal: true,
                html: Lumen.I18N_LABELS.applicationIsCompleteInstructions,
                width: 350,
                bodyStyle: 'padding: 10px 20px;',
                autoScroll: true,

                buttons: [
                    {
                        text: 'Ok',
                        handler: function () {
                            this.up('window').close();
                        }
                    },
                    {
                        text: 'Submit Application',
                        handler: function () {
                            if (Lumen.getApplication().getAdmissionApplicationStore().applicationFeeIsPaid()) {
                                self.submitApplication(true);
                            } else {
                                var popup = Ext.widget('window', {
                                    title: 'Application Fee is required',
                                    modal: true,
                                    html: Lumen.i18n('payApplicationFeeToSubmitInstructions'),
                                    width: 350,
                                    bodyStyle: 'padding: 10px 20px;',
                                    autoScroll: true,

                                    buttons: [
                                        {
                                            text: 'Ok',
                                            handler: function () {
                                                this.up('window').close();
                                                var applicationFeePanel = self.getComponent("applicationFeePanel");
                                                if (applicationFeePanel) {
                                                    self.setActiveTab(applicationFeePanel);
                                                }
                                            }
                                        }
                                    ]
                                });

                                popup.show();
                            }
                            this.up('window').close();
                        }
                    }
                ]
            });
            popup.show();
        } else {
            var totalCompletion = new Number((requiredFieldMap.totals.totalRequired / requiredFieldMap.totals.totalComplete) * 100);
            var completionText = totalCompletion.toPrecision(totalCompletion >= 10 ? 2 : 1) + "% ";

            var popup = Ext.widget('window', {
                title: 'Your application is not complete.',
                modal: true,
                html: Lumen.I18N_LABELS.applicationIsNotCompleteInstructions,
                width: 350,
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
    createButtons: function () {
        var self = this;
        var buttons = [
            {
                text: 'Save Application',
                tooltip: Lumen.I18N_LABELS.saveApplicationButtonTooltip,
                itemId: "saveButton",
                handler: function () {
                    self.submitApplication(false)
                }
            },
            {
                text: 'Submit Application',
                tooltip: Lumen.I18N_LABELS.submitApplicationButtonTooltip,
                itemId: "submitButton",
                disabled: true,
                handler: function () {
                    self.submitApplication(true)
                }
            },
            {
                text: 'Verify Application Completeness',
                tooltip: Lumen.I18N_LABELS.checkApplicationButtonTooltip,
                handler: function () {
                    self.verifyCompleteness();
                }
            }
        ];
        return buttons;

    },

    findInvalidFields: function (fields) {
        var requiredFieldMap = {
            totals: {totalComplete: 0,totalRequired: 0}
        };
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var completenessContainer = field.up("[completeSection]");
            var validatingContainer = field.up("[validating]");
            var completedFields = requiredFieldMap[completenessContainer.id];
            if (!completedFields) {
                completedFields = {requiredFieldCount: 0,completedFieldCount: 0};
                requiredFieldMap[completenessContainer.id] = completedFields;
            }
            var requiredField = (field.allowBlank === false) || (validatingContainer && validatingContainer.required);
            if (requiredField) {
                completedFields.requiredFieldCount++;
                requiredFieldMap.totals.totalComplete++;
                if ((!validatingContainer && field.getErrors().length == 0) || (validatingContainer && validatingContainer.validate())) {
                    completedFields.completedFieldCount++;
                    requiredFieldMap.totals.totalRequired++;
                }
            }
        }

        var feeIsPaid = Lumen.getApplication().getAdmissionApplicationStore().applicationFeeIsPaid();
        if (requiredFieldMap.totals.totalRequired == requiredFieldMap.totals.totalComplete && feeIsPaid) {
            this.ownerCt.queryById("submitButton").setDisabled(false);
        }  else {
            this.ownerCt.queryById("submitButton").setDisabled(true);
        }
        return requiredFieldMap;
    },

    updateInvalidContainers: function (requiredFieldMap) {
        for (var containerId in requiredFieldMap) {
            if(containerId != "totals") {
                var completedFields = requiredFieldMap[containerId];
                var container = Ext.getCmp(containerId);
                if (!container.titleWithNoCompleteness) {
                    container.titleWithNoCompleteness = container.title;
                }
                var completion = new Number((completedFields.completedFieldCount / completedFields.requiredFieldCount) * 100);
                var title;
                if (completion == 100) {
                    title = "Complete";
                    container.setTitle(container.titleWithNoCompleteness + " - <span class='completeText'>Complete</span>");
                } else if (completion == 0) {
                    container.setTitle(container.titleWithNoCompleteness + " - <span class='moreInfoText'>More Information Needed</span>");
                } else {
                    if (!isNaN(completion)) {
                        title = completion.toPrecision(completion >= 10 ? 2 : 1) + "% Complete";
                        container.setTitle(container.titleWithNoCompleteness + " - <span class='almostComplete'>" + title + "</span>");
                    }
                }
            }
        }
    }
});
