/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
Ext.Loader.setConfig({
    paths : {
        'Overrides': 'app/overrides'
    }
});
Ext.Loader.config.disableCaching = false;

Ext.application({
    name: 'Lumen',
    autoCreateViewport: false,

    views: [
        'Main',
        'UIContent',
        'LoginPanel',
        'Descriptions',
        'BaseForm',
        'FamilyInfo',
        'JSONFormContainer',
        'BaseApplication',
        'AdminDashboard',
        'StudentParentTree',
        'finance.Fee',
        'finance.DebitScheduleEntry',
        'finance.DebitSchedule',
        'form.PaymentPlanForm',
        'form.FieldGroupMixin',
        'form.ProductCheckBoxGroup',
        'form.TextAreaFieldSet',
        'form.FormLoader',
        'form.FileUploadHTML5',
        'form.MultipleChoiceQuestion',
        'form.TuitionOptions',
        'form.EvaluationForm',
        'form.MultiAnswerQuestion',
        'form.CreditCardForm',
        'form.BindableCheckboxGroup',
        'form.BindableRadioGroup',
        'form.MultiAnswerQuestionGrid',
        'form.RadioGroupContainer',
        'form.ShortQuestion',
        'form.PhoneNumber',
        'PersonInfo',
        'form.PersonName',
        'AccordionStretch',
        'form.ImageDrop',
        'form.Address'
    ],

    stores: [
        'AdmissionApplicationList',
        'Person',
        'Student',
        'DebitSchedule',
        'JSONForm',
        'DebitScheduleTemplate',
        'Authentication',
        'AdmissionApplication',
        'UIState'],

    models: [
        'AdmissionApplication',
        'DebitSchedule',
        'DebitScheduleEntry',
        'DebitScheduleTemplate',
        'Principal',
        'Person',
        'Student'
    ],

    controllers: [
        'PaymentPlanController',
        'UserStartup',
        'MainDisplayController',
        'JsonPathFormController',
        'ExternalPartyController'],

    init: function() {
        //Hack found on the forums to fix safari always showing a
        //40px wide tooltip.
        delete Ext.tip.Tip.prototype.minWidth;

        if(Ext.isIE10) {
            Ext.supports.Direct2DBug = true;
        }
        //end Hack
        //        Ext.util.Observable.prototype.fireEvent =
//            Ext.Function.createInterceptor(function(a, b, c, d, e) {
//            console.log("event " + this.name);
//            console.log("Args " + Ext.JSON.encode(arguments));
//            return true;
//        });
        Ext.removeNode(Ext.getDom("lumenBodyWaitingScreen"));
        Ext.removeNode(Ext.getDom("guidanceText"));

        Lumen.NEW_APPLICATION       = "NEW_APPLICATION";
        //CLIENT_VERSION and SERVER_VERSION should always be the same.
        Lumen.CLIENT_VERSION       = "CLIENT_VERSION";
        Lumen.APPLICATION_ERROR       = "APPLICATION_ERROR";
        Lumen.SHOW_APPLICATION_FORM = "SHOW_APPLICATION_FORM";
        Lumen.REPLACE_MAIN_DISPLAY  = "REPLACE_MAIN_DISPLAY";
        Lumen.MAIN_DISPLAY_REPLACED  = "MAIN_DISPLAY_REPLACED";
        Lumen.SHOW_MENU             = "SHOW_MENU";
        Lumen.AJAXIFY               = "AJAXIFY";
        Lumen.JSON_PATH_FORM_SUBMIT = "JSON_PATH_FORM_SUBMIT";
        Lumen.FORM_FIELD_EVENT = "FORM_FIELD_EVENT";
        Lumen.EXPAND_EVERYTHING = "EXPAND_EVERYTHING";
        Lumen.EVALUATION_FORM_SUBMIT = "EVALUATION_FORM_SUBMIT";
        Lumen.FORM_SUBMIT = "FORM_SUBMIT";//Not used.  Delete.
        Lumen.LOGIN_FORM_SUBMIT = "LOGIN_FORM_SUBMIT";
        Lumen.AUTHENTICATION_READY = "AUTHENTICATION_READY";
        Lumen.WINDOW_INITIALIZED = "WINDOW_INITIALIZED";
        Lumen.UPLOAD_FILE = "UPLOAD_FILE";
        Lumen.FILE_ADDED = "FILE_ADDED";
        Lumen.OWNER_LOADED = "OWNER_LOADED";
        Lumen.POPULATE_FORM = "POPULATE_FORM";
        Lumen.ADMISSION_APPLICATION_SAVED = "ADMISSION_APPLICATION_SAVED";
        Lumen.ADMISSION_APPLICATION_FEE_PAID = "ADMISSION_APPLICATION_FEE_PAID";
        Lumen.DESTROY_ALL_FORMS = "DESTROY_ALL_FORMS";
        Lumen.SHOW_ENROLLMENT_DOCUMENTS = "SHOW_ENROLLMENT_DOCUMENTS";
        Lumen.UI_CONTENT_INITIALIZED = "UI_CONTENT_INITIALIZED";
        Lumen.SEND_NOTIFICATION = "SEND_NOTIFICATION";
        Lumen.SEND_EVALUATION = "SEND_EVALUATION";
        Lumen.SAVE_JSON_ENTITY = "SAVE_JSON_ENTITY";
        Lumen.SAVE_SAVEABLE_FORMS = "SAVE_SAVEABLE_FORMS";
        Lumen.ADD_EVALUATION = "ADD_EVALUATION";
        Lumen.LOAD_DOCUMENT_LIST = "LOAD_DOCUMENT_LIST";
        Lumen.PROMPT = "PROMPT";
        Lumen.LOAD_PAYMENT_PLAN_TEMPLATES = "LOAD_PAYMENT_PLAN_TEMPLATES",
        Lumen.BIND_FORM_FIELDS = "BIND_FORM_FIELDS",
        Lumen.LOAD_FAMILY_INFO = "LOAD_FAMILY_INFO",

        Lumen.SHORT_TEXT = 1;
        Lumen.MEDIUM_TEXT = 2;
        Lumen.LONG_TEXT = 3;
        Lumen.DROP_DOWN = 4;
        Lumen.NUMBER = 5;
        Lumen.SLIDER_1_10 = 6;
        Lumen.DATE = 7;
        Lumen.EXCLUSIVE_CHOICE = 8;
        Lumen.MULTIPLE_CHOICE = 9;
        Lumen.MULTI_ANSWER = 10;
        Lumen.MULTI_ANSWER_GRID = 11;
        Lumen.SURVEY_GRID = 12;
        Lumen.ADDRESS = 13;
        Lumen.FILE = 14;
        Lumen.IMAGE = 15;
        Lumen.PERSON_NAME = 16;
        Lumen.PHONE_NUMBER = 17;
        Lumen.RHETORICAL = 18;
    },

    requires: ['Ext.Ajax',
        'Ext.data.proxy.Rest',
        'Lumen.store.RestStore',
        'Lumen.view.RemoveButton',
        'Ext.form.field.Checkbox',
        'Overrides.form.field.Checkbox',
        'Ext.grid.plugin.CellEditing',
        'Lumen.store.CountryStore',
        'Lumen.store.Person',
        'Lumen.store.Student',
        'Lumen.store.Applicant',
        'Lumen.store.StateStore',
        'Lumen.model.JSONForm',
        'Lumen.store.JSONForm',
        'Lumen.view.JSONForm',
        'Ext.tab.Panel',
        'Ext.layout.container.Column',
        'Ext.form.field.Hidden',
        'Ext.form.Label',
        'Ext.form.RadioGroup',
        'Ext.layout.container.Table',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox',
        'Ext.util.Cookies',
        'Ext.data.UuidGenerator',
        //'Lumen.view.EvaluationLoader',
        'Lumen.controller.util.HtmlExtractor',
        'Lumen.controller.util.DomWalker',
        'Lumen.controller.util.QueryData',
        'Lumen.controller.util.JSONPath',
        'Lumen.controller.util.Base64',
        'Lumen.model.Person',
        'Lumen.model.Student',
        'Lumen.model.Applicant',
        'Lumen.view.outputgenerators.HtmlOutputGenerator',
        'Lumen.view.outputgenerators.OutputGenerator',
        'Lumen.view.outputgenerators.Date',
        'Lumen.view.outputgenerators.RadioGroup'],

//    loadExternalizedResource: function (messagesUrl, successCallback) {
//        console.log("Loading external resource " + messagesUrl);
//        var uiServiceURL = Lumen.DATA_SERVICE_URL_ROOT + '/uiService.php';
//        Ext.Ajax.request({
//            url: uiServiceURL,
//            params: {
//                contentUrl: messagesUrl,
//                json: true
//            },
//            scope: this,
//            async: false,
//            method: "GET",
//            failure: function (response) {
//                alert("UIService failed: " + JSON.encode(response));
//            },
//            success: function (response, opts) {
//                try {
//                    successCallback(JSON.parse(response.responseText));
//                } catch (error) {
//                    var errorMessage = "The json file " + messagesUrl + " at " + uiServiceURL + " has been corrupted.  The text can be validated at http://jsonlint.com/.  The system will be inoperable until this is fixed";
//                    alert(errorMessage);
//                }
//            }
//        });
//    },

    launch: function() {
        Lumen.QUESTION_CHOICE_MAP = {};
        Lumen.HACK_APPLICATION_ID = null;//This exists for the case when data is requested for an admission application before the application store has been loaded.
        //This is the case when a list of documents is requested.

        Ext.tip.QuickTipManager.init();
        var self = this;
        Lumen.getApplication = function() {return self;};
        Lumen.i18n = function(text, textType) {
            return self.i18nText(text, textType);
        };
        Lumen.log = function(message, start) {
            var finish = new Date().getTime();
            var durationText = "";
            if(start) {
                var duration = finish - start;
                if(duration > 1500) {
                    durationText = (duration/1000).toFixed(2) + "s :";
                }  else {
                    durationText = duration + "ms :"
                }
            }
            if(console && console.log) {
                console.log(durationText + " " + message);
            }
        };
        Lumen.msg = function(title, format){
//            if(!Lumen.msgCt){
//                Lumen.msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
//            }
//            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
//            var m = Ext.DomHelper.append(Lumen.msgCt,
//                '<div class="msg ' + Ext.baseCSSPrefix + 'border-box"><h3>' + title + '</h3><p>' + s + '</p></div>',
//                true);
//            m.hide();
//            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        },

        this.outputGeneratorMap = {
            textfield: new Lumen.view.outputgenerators.OutputGenerator(),
            panel: new Lumen.view.outputgenerators.HtmlOutputGenerator(),
            datefield: new Lumen.view.outputgenerators.Date(),
            combobox: new Lumen.view.outputgenerators.OutputGenerator(),
            radiogroup: new Lumen.view.outputgenerators.RadioGroup(),
            checkboxgroup: new Lumen.view.outputgenerators.RadioGroup()
        };

        //If you get an error down the stack because of a null el its
        //because your index.php or index.html <body>doesn't have the lumenbody element
        Ext.create("Lumen.view.Main");
        self.getAuthenticationStore().load(new Lumen.controller.util.QueryData());
    },

    i18nText: function(text, textType) {
        textType = textType || Lumen.PROMPT;
        switch(textType) {
            case Lumen.PROMPT: {
                var i18nValue = Lumen.I18N_PROMPTS[text];
                return i18nValue || text;
            }
        }
    },

    updateApplicationStatus: function (popup, status, applicationId) {

        var self = this;
        Ext.Ajax.request({
            url: Lumen.DATA_SERVICE_URL_ROOT + "/updateApplication.php",
            params: {
                action: 'updateStatus',
                applicationId: applicationId || self.getApplicationId(),
                status: status
            },
            method: "POST",
            context: self,
            failure: function (response) {
                if(popup) {
                    popup.close();
                }
                self.fireEvent(Lumen.APPLICATION_ERROR, {message: response.responseText});
            },
            success: function (response, opts) {

                if(popup) {
                    popup.close();
                }
                //self.sendEnrollmentConfirmation();
            }
        });
    },

    getOutputGenerator: function(type) {
        var generator = this.outputGeneratorMap[type];
        return generator;
    },
    addStudentEvaluation: function(evaluation) {
        return this.getAdmissionApplicationStore().addStudentEvaluation(evaluation);
    },
    getApplicationId: function() {
        var applicationId = this.getAdmissionApplicationStore().getApplicationId();
        if(applicationId === null) {
            //Get the application id from the form
            var formStore = this.getStore("Lumen.store.JSONForm");
            if(formStore.getCount() == 1) {
                applicationId = formStore.first().get("applicationId");
            }
        }
        return applicationId;
    },
    getApplicationData: function() {
        return this.getAdmissionApplicationStore().first().raw || this.getAdmissionApplicationStore().first().data;
    },
    setApplicationType: function(type) {
        return this.getAdmissionApplicationStore().setApplicationType(type);
    },
    setGuestDaysRequested: function(completed, args) {
        return this.getAdmissionApplicationStore().setGuestDaysRequested(completed, args);
    },
    getGuestDaysRequested: function() {
        return !!(this.getAdmissionApplicationStore().getGuestDaysRequested());
    },
    getApplicationIsNew: function() {
        return this.getAdmissionApplicationStore().getApplicationIsNew();
    },
    getStudentApplicantName: function() {
        var child = this.getChildFromDataStore();
        if(child) {
            return ((child.firstName ? child.firstName : "") + " " +
                (child.lastName ? child.lastName : "")).trim();
        } else {
            return "No Name";
        }
    },

    getStudentApplicantFirstNameForChild: function (child) {
        return child.firstName ? child.firstName : "";
    },

    getStudentApplicantFirstName: function() {
        var child = this.getChildFromDataStore();
        return this.getStudentApplicantFirstNameForChild(child);
    },
    getChildFromDataStore: function() {
        var admissionApplicationStore = this.getAdmissionApplicationStore();
        var first = admissionApplicationStore.first();
        if(first) {
            var data = first.raw || first.data;
            return data.Child
        } else {
            first = Ext.data.StoreManager.lookup('Lumen.store.Applicant').first();
            return first ? (first.raw || first.data) : null;
        }
    },
    getParentFirstNamesFromChild: function (child) {
        var parents = child.guardianList;
        var names = "";
        var seenParent = false;
        for (var i = 0; i < parents.length; i++) {
            var parent = parents[i];
            if (parent.guardian && parent.guardian.firstName) {
                if (seenParent) {
                    names += Lumen.i18n(" and" + " ");
                }
                seenParent = true;
                names += parent.guardian.firstName.trim();
            }
        }
        return names;
    },

    getParentFirstNames: function() {
        var child = this.getChildFromDataStore();

        if(child && child.guardianList) {
                return this.getParentFirstNamesFromChild(child);
            } else {
                return "No Name";
            }
    },
    getParentLoginEmailAndPasswordForParents: function (parents) {
        var loginEmailAndPasswords = [];
        for (var i = 0; i < parents.length; i++) {
            var parent = parents[i];
            if (parent.guardian && parent.guardian.login) {
                var login = parent.guardian.login;
                loginEmailAndPasswords.push({
                    email: login.Username,
                    temporaryPassword: login.TemporaryPassword
                });
            }
        }
        return loginEmailAndPasswords;
    },

    getParentloginEmailAndPasswords: function() {
        var child = this.getChildFromDataStore();
        if(child) {
            if(child.guardianList) {
                return this.getParentLoginEmailAndPasswordForParents(child.guardianList);
            }
        }
    },
    getParentEmails: function() {
        var emails = "";
        var child = this.getChildFromDataStore();
        if(child && child.guardianList) {
            var seenParent = false;
            var parents = child.guardianList;
            for(var i=0; i < parents.length; i++) {
                var parent = parents[i];
                if(parent.guardian && parent.guardian.emailList && parent.guardian.emailList[0].emailAddress) {
                    if(seenParent) {
                        emails +=",";
                    }
                    seenParent = true;
                    emails += parent.guardian.emailList[0].emailAddress.trim();
                }
            }
        } else {
            return "No Name";
        }
        return emails;
    },

    getUserId: function() {
        var authenticationStore = this.getAuthenticationStore();
        var personData = authenticationStore.first() ? authenticationStore.first().raw : null;
        return personData.systemId
    },

    userIsAdmin: function () {
        var authenticationStore = this.getAuthenticationStore();

        var personData = authenticationStore.first() ? authenticationStore.first().raw : null;

        if (personData && personData['login']['groups']) {
            var groups = personData['login']['groups'];
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].groupName == "admin") {
                    return true;
                }
            }
        }
        return false;
    }
});
if(typeof LumenClient == "undefined") {
    Lumen.loadExternalCode();
}
//window.ondragenter = function(e)
//{
//    e.dataTransfer.dropEffect = 'none';
//    e.preventDefault();
//    return false;
//};
//
//window.ondragover = function(e)
//{
//    e.preventDefault();
//    return false;
//};

window.ondrop = function(e)
{
    e.preventDefault();
    return false;
};

window.ondragleave = function(e)
{
    return false;
};
/*
 * Inspired by : http://www.rahulsingla.com/blog/2010/04/extjs-preserving-rowexpander-markup-across-view-refreshes
 * Reappend element to DOM : http://stackoverflow.com/questions/20143082/does-extjs-automatically-garbage-collect-components
 */

Ext.define('Ext.ux.ComponentRowExpander', {
    extend: 'Ext.ux.RowExpander',

    alias: 'plugin.cmprowexpander',

    rowBodyTpl : ['<div></div>'],

    obj_recordId_componentId: {},

    init: function(grid) {
        this.callParent(arguments) ;

        var view = grid.getView() ;
        view.on('refresh', this.onRefresh, this);
        view.on('expandbody', this.onExpand, this);

        grid.on('destroy', this.onDestroyGrid, this) ;
        grid.headerCt.on('columnresize', this.onColumnResize, this) ;

        this.obj_recordId_componentId = {} ;
    },

    getRecordKey: function(record) {
        return (record.internalId);
    },

    createComponent: function(view, record, rowNode, rowIndex) {
        return Ext.create('Ext.Component') ;
    },

    onExpand: function(rowNode, record, expandRow) {        var recordId = this.getRecordKey(record) ;
        var targetRowbody = Ext.DomQuery.selectNode('div.x-grid-rowbody', expandRow);
        if( Ext.isEmpty( this.obj_recordId_componentId[recordId] ) ) {
            var view = this.grid.getView(),
                newComponent = this.createComponent(view, record, rowNode, view.indexOf(rowNode));


            while (targetRowbody.hasChildNodes()) {
                targetRowbody.removeChild(targetRowbody.lastChild);
            }
            newComponent.render( targetRowbody ) ;


            this.obj_recordId_componentId[recordId] = newComponent.getId() ;
        }
        else
        {
            var cmpId = this.obj_recordId_componentId[recordId] ;


            var reusedComponent = Ext.getCmp(this.obj_recordId_componentId[recordId]);


            while (targetRowbody.hasChildNodes()) {
                targetRowbody.removeChild(targetRowbody.lastChild);
            }


            targetRowbody.appendChild( reusedComponent.getEl().dom );
            reusedComponent.doComponentLayout() ;
        }
    },

    onRefresh: function(view) {
        var reusedCmpIds = [] ;
        Ext.Array.each( view.getNodes(), function(node) {
            var record = view.getRecord(node),
                recordId = this.getRecordKey(record) ;

            if( !Ext.isEmpty(this.obj_recordId_componentId[recordId]) ) {
                var cmpId = this.obj_recordId_componentId[recordId] ;

                reusedCmpIds.push(cmpId) ;
                var reusedComponent = Ext.getCmp(this.obj_recordId_componentId[recordId]),
                    targetRowbody = Ext.DomQuery.selectNode('div.x-grid-rowbody', node);
                while (targetRowbody.hasChildNodes()) {
                    targetRowbody.removeChild(targetRowbody.lastChild);
                }

                targetRowbody.appendChild( reusedComponent.getEl().dom );
                reusedComponent.doComponentLayout() ;
            }
        },this) ;


        // Do Garbage collection
        // Method 1 ( http://skirtlesden.com/static/ux/download/component-column/1.1/Component.js )
        var keysToDelete = [] ;
        Ext.Object.each( this.obj_recordId_componentId, function( recordId, testCmpId ) {
            comp = Ext.getCmp(testCmpId);
            el = comp && comp.getEl();

            if (!el || (true && (!el.dom || Ext.getDom(Ext.id(el)) !== el.dom))) {
                // The component is no longer in the DOM
                if (comp && !comp.isDestroyed) {
                    comp.destroy();
                    keysToDelete.push(recordId) ;
                }
            }
        }) ;

        // Method 2
        /*
         Ext.Object.each( this.obj_recordId_componentId, function( recordId, testCmpId ) {
         if( !Ext.Array.contains( reusedCmpIds, testCmpId ) ) {
         comp = Ext.getCmp(testCmpId);
         comp.destroy();
         keysToDelete.push(recordId) ;
         }
         }) ;
         */

        // Clean map
        Ext.Array.each( keysToDelete, function(mkey) {
            delete this.obj_recordId_componentId[mkey] ;
        },this);
    },

    onColumnResize: function() {
        Ext.Object.each( this.obj_recordId_componentId, function( recordId, cmpId ) {
            Ext.getCmp(cmpId).doComponentLayout();
        }) ;
    },

    onDestroyGrid: function() {
        Ext.Object.each( this.obj_recordId_componentId, function(recordId, cmpId) {
            Ext.getCmp(cmpId).destroy() ;
        }) ;
    }
});

//Polyfill for endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}