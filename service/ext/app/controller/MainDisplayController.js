Ext.define('Lumen.controller.MainDisplayController', {
    extend: 'Ext.app.Controller',
    stores: ['Lumen.store.AdmissionApplicationList', 'Lumen.store.Authentication', 'Lumen.store.Applicant', 'Lumen.store.JSONForm'],
    currentMenu: null,
    currentDisplay: null,
    init: function (application) {
        Ext.enableNestedListenerRemoval = true;
        application.on({
            "REPLACE_MAIN_DISPLAY": function (options) {
                Lumen.getApplication().fireEvent(Lumen.DESTROY_ALL_FORMS);
                this.currentDisplay = this.replaceClient(options.newClient, this.currentDisplay, "mainDisplay", options.anchorTarget, options);
                Lumen.getApplication().fireEvent(Lumen.MAIN_DISPLAY_REPLACED);
            },
            "SHOW_MENU": function (options) {
                this.currentMenu = this.replaceClient(options.newClient, this.currentMenu, "menuContainer1", options.anchorTarget)
            },
            "APPLICATION_ERROR": function (options) {
                this.showErrorPopup(options.title, options.message);
            },
            "SHOW_ENROLLMENT_DOCUMENTS": function (options) {
                this.showEnrollmentDocuments(options);
            },
            "SHOW_APPLICATION_FORM": this.showApplicationForm,
            "AJAXIFY": this.ajaxify,
            scope: this
        });
        var splash = Ext.select("#splash", true);
        splash = splash.getCount() == 0 ? null : splash.item(0);

        if (splash) {
            setTimeout(function () {
                Ext.create('Ext.fx.Anim', {
                    target: splash,
                    duration: 800,
                    to: {
                        height: 0
                    },
                    callback: function () {
                        //                        if(menuElement) {
                        //                            menuElement.slideIn('t', animOptions);
                        //                        }
                    },
                    listeners: {
                        afteranimate: function () {
                            Ext.removeNode(splash.dom);
                            splash.remove();
                        }
                    }
                });
            }, 1000);
        }
    },

    showErrorPopup: function (title, message) {
        var title = title || "An error occurred";
        var popup = Ext.widget('window', {
            title: title,
            modal: true,
            html: message,
            width: 300,
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
    },

    showMenu: function (options) {
        var replace = !!options.replace; //Double bang casts to boolean
        var menuContainer = Ext.getCmp("menuContainer1");
        var menu = options.newClient;
        menuContainer.add(menu);
        var menuElement = menu.getEl();
        menuElement.hide(false);
        menu.doLayout();
        var animOptions = {
            easing: "cubic-bezier(0.94, 0.16, 0.94, 0.35)",
            duration: 1000
        };
    },

    showEnrollmentDocuments: function (opts) {
        var applicationId = opts.applicationId;
        var applicant = opts.applicant;
        if (!applicationId) {
            for (var i = 0; i < applicant.documentRightList.length; i++) {
                var documentList = applicant.documentRightList[i];
                if (documentList.documentType == "Enrollment") {
                    applicationId = documentList.systemId;
                }
            }
        }
        var self = this;
        var newClient = Ext.create("Lumen.view.UIContent", {
            params: {
                json: true,
                contentUrl: Lumen.CONTENT_PREFIX + "/Enrollment.js"
            }
        });
        newClient.addListener({
            afterrender: function () {
                self.initializeApplicant(applicant, applicationId);
            }
        });
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: newClient});
    },

    initializeApplicant: function (applicant, applicationId) {
        var self = this;
        Lumen.getApplication().getAdmissionApplicationStore().removeAll();
        //selfy.down('form').getForm().loadRecord(firstPerson);
        var authenticationStore = this.getApplication().getAuthenticationStore();
        var userData = authenticationStore.first() ? authenticationStore.first().raw : null;
        var debitScheduleStore = Ext.data.StoreManager.lookup('DebitSchedule');
        if(applicant.debitScheduleSummary) {
            debitScheduleStore.load({//eww! PaymentPlanController has special knowledge that this is going to happen.
                params: {
                    id: applicant.debitScheduleSummary.id
                }
            });
        }
        //var loadedPerson = Lumen.getApplication().getAuthenticationStore().getById(applicantId);
        var applicantStore = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
        applicantStore.loadData([applicant]);
        var formContainers = Ext.ComponentQuery.query("jsonformcontainer");
        for (var i = 0; i < formContainers.length; i++) {
            var formContainer = formContainers[i];
            var formStore = this.getStore("Lumen.store.JSONForm");

            formStore.iseeYou = true;
            //Lumen.getApplication().fireEvent(Lumen.DESTROY_ALL_FORMS);
            formStore.load({
                params: {
                    documentType: "JSONForm",
                    onlySaveNew: true,
                    id: applicationId
                },
                callback: function (forms, success) {
                    if (success) {
                        if (forms.length == 0) {
                            var newForm = Ext.create("Lumen.model.JSONForm");
                            newForm.raw = {};//ewww
                            formStore.loadData([newForm]);
                        }
                        if (formStore.getCount() == 1) {
                            Lumen.log("\n\n\n\n\n------1 Maybe this is why child data doesn't always load ChildInformation.js may not be 'loaded' by the time this is called");
                            //Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {formRoot: formContainer.down("[dataRoot]"), JSONPathPrefix: ""});
                            var dataRoot = formContainer.down("[dataRoots]");

                            var firstForm = formStore.first();
                            firstForm.set("applicationId", applicationId);
                            Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {
                                modelToLoad: firstForm.raw,
                                formRoot: formContainer,
                                JSONPathPrefix: ""
                            });
                            //You haven't copied all the right deployment stuff so your dataRoots aren't set.
                            Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {
                                modelToLoad: {Child: applicant},
                                formRoot: dataRoot,
                                JSONPathPrefix: ""
                            });
                            if (formStore.getCount() == 0) {//WTF??? How could this ever be true?
                                formStore.loadData(forms, false);
                            }
                            var loginAndEmails = Lumen.getApplication().getParentLoginEmailAndPasswordForParents(applicant.guardianList);

                            var parentFirstNames = Lumen.getApplication().getParentFirstNamesFromChild(applicant);
                            var studentApplicantFirstName = Lumen.getApplication().getStudentApplicantFirstNameForChild(applicant);
                            self.addAdminToolbar(applicant.firstName + " " + applicant.LastName, parentFirstNames, studentApplicantFirstName, loginAndEmails);
                        }
                    } else {
                        alert("Problem loading form store.");
                    }
                }
            });
            //Lumen.log("-2 Maybe this ad the other asynchronicity is why child data doesn't always load");
            //Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {modelToLoad: {Child: applicant}, formRoot: formContainer.down("[dataRoot]"), JSONPathPrefix: ""});
        }
    },

    addAdminToolbar: function (personName, parentFirstNames, studentApplicantFirstName, loginEmailAndPasswords) {
        var adminMenu = Ext.ComponentQuery.query('adminmenu')[0];
        if (adminMenu && Lumen.getApplication().userIsAdmin()) {

            adminMenu.resetToolbar();
            var remindButton = null;
            if (loginEmailAndPasswords) {
                remindButton = Ext.create("Ext.button.Button", {
                    text: Lumen.i18n("Remind") + " " + personName + " to enroll",
                    listeners: {
                        'click': {
                            fn: function () {
                                for (var i = 0; i < loginEmailAndPasswords.length; i++) {
                                    var temporaryPassword = loginEmailAndPasswords[i].temporaryPassword;
                                    if (temporaryPassword) {
                                        var loginEmail = loginEmailAndPasswords[i].email;
                                        Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                                            notifyParams: {
                                                //applicationId: Lumen.getApplication().getApplicationId(),
                                                emailTitle: personName + " " + Lumen.i18n("Enrollment"),
                                                subject: Lumen.i18n("Enrollment"),
                                                link: Lumen.APPLICATION_LINK,
                                                templateURL: Lumen.URL_ENROLL_REMINDER_EMAIL,
                                                notify: loginEmail,
                                                substitutions: {
                                                    "__PARENT_LOGIN_EMAIL__": loginEmail,
                                                    "__PARENT_TEMPORARY_PASSWORD__": temporaryPassword,
                                                    "__PARENT_FIRST_NAMES__": parentFirstNames,
                                                    "__STUDENT_FIRST_NAME__": studentApplicantFirstName
                                                }
                                            }
                                        });
                                    }
                                }
                                var popup = Ext.widget('window', {
                                    title: 'Done',
                                    modal: true,
                                    html: "Reminder sent",
                                    width: 750,
                                    bodyStyle: 'padding: 10px 20px;',
                                    autoScroll: true,

                                    buttons: [
                                        {
                                            text: 'Ok',
                                            handler: function () {
                                                popup.close();
                                            }
                                        }
                                    ]
                                });
                                popup.show();
                            }
                        }
                    }
                });
            }
            var applicationStatus = null;
            if (Lumen.getApplication().getAdmissionApplicationStore().getCount() > 0) {
                applicationStatus = Lumen.getApplication().getApplicationData().Status;
            }

            if (Lumen.getApplication().getStudentApplicantName() &&
                applicationStatus &&
                applicationStatus != "Admitted" &&
                applicationStatus != "Enrolled" &&
                applicationStatus != "Enrolling") {
                var isBootstrapping = applicationStatus == "Bootstrapping";
                var admitButton = Ext.create("Ext.button.Button", {
                        text: Lumen.i18n("Accept") + " " + personName,
                        listeners: {
                            'click': {
                                fn: function () {
                                    var popup = Ext.widget('window', {
                                        title: 'Confirm Acceptance',
                                        modal: true,
                                        html: Lumen.I18N_LABELS.confirmAcceptance,
                                        width: 750,
                                        bodyStyle: 'padding: 10px 20px;',
                                        autoScroll: true,

                                        buttons: [
                                            {
                                                text: Lumen.i18n('Confirm'),
                                                handler: function () {
                                                    Ext.Ajax.request({
                                                        url: Lumen.DATA_SERVICE_URL_ROOT + "/updateApplication.php",
                                                        params: {
                                                            action: 'updateStatus',
                                                            applicationId: Lumen.getApplication().getApplicationId(),
                                                            status: 'Accepted'
                                                        },
                                                        method: "POST",
                                                        context: this,
                                                        failure: function (response) {
                                                            popup.close();
                                                            Lumen.getApplication().fireEvent(Lumen.APPLICATION_ERROR, {message: response.responseText});
                                                        },
                                                        success: function (response, opts) {
                                                            popup.close();
                                                            if (isBootstrapping) {
                                                                var loginEmailAndPasswords = Lumen.getApplication().getParentloginEmailAndPasswords();
                                                                for (var i = 0; i < loginEmailAndPasswords.length; i++) {
                                                                    var loginEmail = loginEmailAndPasswords[i].email;
                                                                    var temporaryPassword = loginEmailAndPasswords[i].temporaryPassword;
                                                                    Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                                                                        notifyParams: {
                                                                            //applicationId: Lumen.getApplication().getApplicationId(),
                                                                            emailTitle: Lumen.getApplication().getStudentApplicantName() + " " + Lumen.i18n("Admission Acceptance"),
                                                                            subject: Lumen.i18n("Re-enrollment"),
                                                                            link: Lumen.APPLICATION_LINK,
                                                                            templateURL: Lumen.URL_REENROLL_BOOTSTRAP_EMAIL,
                                                                            notify: Lumen.getApplication().getParentEmails(),
                                                                            substitutions: {
                                                                                "__PARENT_LOGIN_EMAIL__": loginEmail,
                                                                                "__PARENT_TEMPORARY_PASSWORD__": temporaryPassword,
                                                                                "__PARENT_FIRST_NAMES__": Lumen.getApplication().getParentFirstNames(),
                                                                                "__STUDENT_FIRST_NAME__": Lumen.getApplication().getStudentApplicantFirstName()
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            } else {
                                                                Lumen.getApplication().fireEvent(Lumen.SEND_NOTIFICATION, {
                                                                    notifyParams: {
                                                                        //applicationId: Lumen.getApplication().getApplicationId(),
                                                                        emailTitle: Lumen.getApplication().getStudentApplicantName() + " " + Lumen.i18n("Admission Acceptance"),
                                                                        subject: Lumen.i18n("Admission Acceptance"),
                                                                        link: Lumen.APPLICATION_LINK,
                                                                        templateURL: Lumen.URL_ACCEPTANCE_EMAIL_NOTIFICATION,
                                                                        notify: Lumen.getApplication().getParentEmails(),
                                                                        substitutions: {
                                                                            "__PARENT_LOGIN_EMAIL__": loginEmail,
                                                                            "__PARENT_TEMPORARY_PASSWORD__": temporaryPassword,
                                                                            "__PARENT_FIRST_NAMES__": Lumen.getApplication().getParentFirstNames(),
                                                                            "__STUDENT_FIRST_NAME__": Lumen.getApplication().getStudentApplicantFirstName()
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                handler: function () {
                                                    this.up('window').close();
                                                }
                                            }
                                        ]
                                    });
                                    popup.show();
                                }
                            }
                        }
                    }
                );
//            var inviteToGuestDays = Ext.create("Ext.button.Button", {
//                    text: Lumen.i18n("Invite") + " " +  Lumen.getApplication().getStudentApplicantName() + " " + Lumen.i18n("to guest days"),
//                    listeners: {
//                        'click': {
//                            fn:  function(){
//                                var popup = Ext.widget('window', {
//                                    title: Lumen.i18n('Confirm Invitation'),
//                                    modal: true,
//                                    html: Lumen.I18N_LABELS.confirmGuestDayInvitation,
//                                    width: 750,
//                                    bodyStyle: 'padding: 10px 20px;',
//                                    autoScroll: true,
//
//                                    buttons: [
//                                        {
//                                            text: Lumen.i18n('Confirm Invitation'),
//                                            handler: function () {
//                                                Ext.Ajax.request({
//                                                    url: Lumen.DATA_SERVICE_URL_ROOT + "/updateApplication.php",
//                                                    params: {
//                                                        action: 'updateStatus',
//                                                        applicationId: Lumen.getApplication().getApplicationId(),
//                                                        status: 'Invited'
//                                                    },
//                                                    method: "POST",
//                                                    context: this,
//                                                    failure: function (response) {
//                                                        Lumen.getApplication().fireEvent(Lumen.APPLICATION_ERROR,{message: response.responseText});
//                                                    },
//                                                    success: function (response,opts) {
//                                                    }
//                                                });
//                                            }
//                                        },
//                                        {
//                                            text: 'Cancel',
//                                            handler: function () {
//                                                this.up('window').close();
//                                            }
//                                        }
//                                    ]
//                                });
//                                popup.show();
//                            }
//                        }
//                    }
//                }
//            );
                var rejectButton = Ext.create("Ext.button.Button", {
                        text: Lumen.i18n("Reject Application") + " ",
                        listeners: {
                            'click': {
                                fn: function () {
                                    var popup = Ext.widget('window', {
                                        title: 'Confirm Acceptance',
                                        modal: true,
                                        html: Lumen.I18N_LABELS.confirmRejection,
                                        width: 750,
                                        bodyStyle: 'padding: 10px 20px;',
                                        autoScroll: true,

                                        buttons: [
                                            {
                                                text: Lumen.i18n('Ok'),
                                                handler: function () {
                                                    Ext.Ajax.request({
                                                        url: Lumen.DATA_SERVICE_URL_ROOT + "/updateApplication.php",
                                                        params: {
                                                            action: 'updateStatus',
                                                            applicationId: Lumen.getApplication().getApplicationId(),
                                                            status: 'Rejected'
                                                        },
                                                        method: "POST",
                                                        context: this,
                                                        failure: function (response) {
                                                            Lumen.getApplication().fireEvent(Lumen.APPLICATION_ERROR, {message: response.responseText});
                                                        },
                                                        success: function (response, opts) {
                                                            popup.close();
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: 'Cancel',
                                                handler: function () {
                                                    this.up('window').close();
                                                }
                                            }
                                        ]
                                    });
                                    popup.show();
                                }
                            }
                        }
                    }
                );

            }

            var toolbarButtons = [];
            if (admitButton) {
                toolbarButtons.push(admitButton);
            }
            if (rejectButton) {
                toolbarButtons.push(rejectButton);
            }
            if (remindButton) {
                toolbarButtons.push(remindButton);
            }
            if (toolbarButtons.length > 0) {
                adminMenu.addToolbarButtons(toolbarButtons);
            }
        }
    }
    ,

    /**
     * Searches for elements with a class
     * ajaxTarget starting at options.root.
     * Then searches for an anchor tag in the
     * target, adds a click listener to replace
     * the main display when clicked.
     * @param options
     */
    ajaxify: function (options) {
        var selfy = this;
        var targets = Ext.query(".ajaxTarget", options.root);
        if (selfy.getApplication().getAuthenticationStore().first()) {

            var anonymousOnly = Ext.query('.anonymousOnly', options.root);
            if (anonymousOnly) {
                Ext.Array.each(anonymousOnly, function (target) {
                    Ext.removeNode(target);
                })
            }
        }
        Ext.Array.each(targets, function () {
            var element = Ext.fly(this);
            var links = element.select("a", "true");
            var link = links.item(0);
            if (link && !link.ajaxified) {
                link.ajaxified = true;
                element.on('click', function (e, t, eOpts) {
                    e.preventDefault();
                    e.stopEvent();

                    if (options.showApplication) {

                    } else {
                        var href = link.getAttribute("href");
                        var queryData = new Lumen.controller.util.QueryData(href);
                        var params = queryData.params;
                        var url = queryData.url;
                        params.contentUrl = url;
                        if (selfy.getApplication().getAuthenticationStore().first()) {
                            var newClient = Ext.create("Lumen.view.UIContent", {params: params});
                            Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: newClient});
                        } else {
                            Lumen.getApplication().getUIStateStore().nextViewOptions = {params: params};
                            var loginPanel = Ext.create("Lumen.view.LoginPanel");
                            Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: loginPanel});
                        }
                    }
                });
            }
        });
    }
    ,

    showApplicationForm: function (opts) {
        var self = this;

        if (opts.applicationId) {
            applicationId = opts.applicationId
        } else {
            var person = opts.person.raw || opts.person;
            var documentRights = person.documentRightList;
            var warning = "Could not find the students application id.  Look in AdmissionApplicationGrid.js"
            var applicationId = warning;
            //Find the application that the student is the subject of.
            for (var i in documentRights) {
                var right = documentRights[i];
                if (right.accessType == "subject" && right.documentType == opts.type) {
                    if(applicationId != warning) {
                        Lumen.log("!!!! There were more than one applications found.");
                    }
                    applicationId = right.systemId;
                    Lumen.HACK_APPLICATION_ID = applicationId;
                }
            }
        }
        applicationId = applicationId || "Could not find the students application id.  Look in AdmissionApplicationGrid.js"
        Lumen.RENDER_FOR_PRINT = opts.renderForPrint;
        Lumen.getApplication().getAdmissionApplicationStore().load({
            params: {applicationId: applicationId},
            scope: this,
            callback: function (data) {
                var application = data[0].raw;
                var newClient = Ext.create("Lumen.view.UIContent", {
                    params: {
                        json: true,
                        contentUrl: Lumen.CONTENT_PREFIX + "/" + application.ApplicationType + ".js"
                    }
                });
                Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: newClient});

                var parentFirstNames = Lumen.getApplication().getParentFirstNames();
                var studentApplicantFirstName = Lumen.getApplication().getStudentApplicantFirstName();
                self.addAdminToolbar(Lumen.getApplication().getStudentApplicantName(),
                    parentFirstNames,
                    studentApplicantFirstName,
                    Lumen.getApplication().getParentloginEmailAndPasswords());
            }
        });
    }
    ,

    _replace: function (replacement, containerName, anchorTarget) {
        var container = Ext.getCmp(containerName);
        var children = container.childEls;
        //container.removeChildEls();
        container.removeAll(true);
        for (var i = 0; i < children.length; i++) {
            //    var child = children[i];
            //    Ext.removeNode(child.dom);
            //    container.remove(child);
        }

        container.add(replacement);
        replacement.el.setOpacity(0);
        //container.doLayout();
        replacement.el.fadeIn({
            opacity: 1,
            duration: 800,
            listeners: {
                afteranimate: function (anim) {
                    if (anchorTarget) {
                        var anchorTarget = replacement.select("a[name=" + anchorTarget + "]");
                        anchorTarget.scrollIntoView();
                        anchorTarget.highlight();
                    }
                }
            }
        });

        if (anchorTarget) {
            var anchorTarget = replacement.select("a[name=" + anchorTarget + "]");
            anchorTarget.scrollIntoView();
            anchorTarget.highlight();
        }
    }
    ,

    replaceClient: function (newClient, currentClient, containerId, anchorTarget, options) {

        var selfy = this;
        if (currentClient && currentClient != newClient) {
            currentClient.el.fadeOut({
                listeners: {
                    afteranimate: function (anim) {
                        selfy._replace(newClient, containerId, anchorTarget);
                    }
                }
            });
        } else {
            this._replace(newClient, containerId, anchorTarget);
        }
        return newClient;

    }
    ,

    refs: [
        {
            // A component query
            selector: '.viewApplicationGrid',
            ref: 'applicationGrid'
        }
    ]
})
;