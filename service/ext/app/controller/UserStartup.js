Ext.define('Lumen.controller.UserStartup', {
    extend: 'Ext.app.Controller',
    stores: ['Lumen.store.Authentication', 'Lumen.store.AdmissionApplicationList', 'Lumen.store.UIState'],
    init: function (application) {
        application.on({
            "AUTHENTICATION_READY": function (args, opts) {
                this.authenticationReady = true;
                this.inititializationCheck()
            },
            "WINDOW_INITIALIZED": function (args, opts) {
                this.windowInitialized = true;
                this.inititializationCheck()
            },
            "LOGIN_FORM_SUBMIT": function (args, opts) {
                //If a login form is submitted. clear initialization state so user can be re-initialized
                this.userInitialized = false;
            },
            scope: this
        });
        //Get query data up and initialized.  When its inicialized and the authentication store is too then the user ui will init.
        new Lumen.controller.util.QueryData().initialize();
    },

    inititializationCheck: function (args, opts) {
        if (!this.userInitialized && this.authenticationReady && this.windowInitialized) {
            this.userInitialized = true;
            this.initializeUserUI();
        }
    },

    initializeUserUI: function (args, opts) {
        var authenticationStore = this.getApplication().getAuthenticationStore();
        var userData = authenticationStore.first() ? authenticationStore.first().raw : null;
        var queryData = new Lumen.controller.util.QueryData();
        if (queryData.get('accessCode')) {
            this.initializeForAccessCode();
        } else if (userData) {
            this.initializeForUser(userData);
        } else {
            this.initalizeForAnonymous();
        }
    },

    initializeForAccessCode: function () {
        var newClient = Ext.create("Lumen.view.EvaluationLoader")
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: newClient});
    },

    initalizeForAnonymous: function () {
        var application = Lumen.getApplication();
        //application.fireEvent(Lumen.SHOW_MENU,  {newClient:  Ext.create("Lumen.view.AdmissionProcessMenu")});
        var intro = Ext.create("Lumen.view.UIContent", {params: {contentUrl: Lumen.URL_APP_INTRO}});
        application.fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: intro});
    },

    initializeForUser: function (userData) {
        var authenticationStore = this.getApplication().getAuthenticationStore();
        var queryData = new Lumen.controller.util.QueryData();
        var debitScheduleTemplateStore = Ext.data.StoreManager.lookup('DebitScheduleTemplate');
        debitScheduleTemplateStore.load();
        var hasAdmin = false;
        var application = Lumen.getApplication();
        Lumen.username = authenticationStore.first().get("login.username");//Hack until we have a real live userData store.
        application.fireEvent(Lumen.OWNER_LOADED, {owner: userData});
        hasAdmin = Lumen.getApplication().userIsAdmin();
        var uiStateStore = this.getApplication().getUIStateStore();
        var nextView;
        var showMenu = true;
        if (queryData.get("userInfo")) {
            showMenu = false;
            nextView = Ext.create("Lumen.view.PersonInfo")
        } else if (uiStateStore.nextViewOptions) {
            nextView = Ext.create("Lumen.view.UIContent", uiStateStore.nextViewOptions);
        }
        if (hasAdmin) {
            application.fireEvent(Lumen.SHOW_MENU, {newClient: Ext.create("Lumen.view.AdminMenu")});
        } else {
            var appList = this.getApplication().getAdmissionApplicationListStore().load({
                params: {
                    ownerId: userData.systemId
                },
                scope: this,
                callback: function (records, operation, success) {
                    //me.getReader() was busted.
                    //I fixed it by making the model have the same name as the file it was in
                    if (records != null) {
                        for (var applicationKey in records) {
                            var admissionApplication = records[applicationKey];
                            var applicationName = "App";

                            if (admissionApplication.Child && admissionApplication.Child.Person) {
                                applicationName = admissionApplication.Child.firstName + " " + admissionApplication.Child.lastName;
                            }
                            var appEntry = Ext.create('Ext.Component', {
                                html: applicationName,
                                width: 300,
                                height: 200,
                                padding: 20,
                                style: {
                                    color: '#FFFFFF',
                                    backgroundColor: '#000000'
                                }
                            });
                        }
                    }
                    if (showMenu) {
                        Lumen.getApplication().fireEvent(Lumen.SHOW_MENU, {newClient: Ext.create("Lumen.view.AdmissionApplicationMenu")});
                    }
                }
            });
        }
        if (!nextView) {
            nextView = Ext.create("Lumen.view.UIContent", {params: {contentUrl: Lumen.URL_APP_INTRO}});
            uiStateStore.nextView = null;
        }
        Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: nextView});
        var headerLinksElement = Ext.select("#header-links");
        if (headerLinksElement.getCount() > 0) {
            var logoutLink = "<div>Logged in as: " + Lumen.username + "<a id='logoutLink' href=Lumen.DATA_SERVICE_URL_ROOT + '/authenticate.php?action=logout' class='logoutLink'>Logout</a></div>";
            headerLinksElement.first().insertHtml("beforeEnd", logoutLink);
        }
    }
});