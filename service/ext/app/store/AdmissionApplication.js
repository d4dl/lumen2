Ext.define('Lumen.store.AdmissionApplication', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.AdmissionApplication',
    idProperty: '_id.$id',
    remoteSort: true,
    constructor: function (config) {
        this.fields = {};
        //This overrides the models proxy if it has one.
        this.proxy = {
            type: 'ajax',
            url: Lumen.DATA_SERVICE_URL_ROOT + '/applicationFinder.php',
            reader: {
                root: 'applications',
                type: 'json',
                idProperty: '_id.$id'
            }
        }
        this.callParent(arguments);
    },

    getApplicationId: function () {
        var firstOne = this.first();
        var id = null;
        if(firstOne != null) {
            id = firstOne.getId();
            if(!id && firstOne.data && firstOne.data._id) {
                id = firstOne.data._id['$id'];
            }
        }
        return id;
    },
    setCharges: function(charges) {
        var first = this.first();
        var applicationData = first.raw || first.data;
        applicationData.Charges = charges;
    },
    getCharges: function() {
        var charges = [];
        var first = this.first();
        var applicationData = first.raw || first.data;
        if(applicationData) {
            charges = applicationData.Charges;
        }
        return charges;
    },

    applicationFeeIsPaid: function() {
        var charges = this.getCharges();
        for(var i=0; (!!charges && i < charges.length); i++) {
            var charge = charges[i];
            if(charge.description == "Admissions Application Fee" && (charge.status == "paid" || charge.status == "succeeded")) {
                return true;
            }
        }
        return false;
    },

    addStudentEvaluation: function(evaluation) {
        var applicationData = this.first();

        applicationData = applicationData.raw || applicationData.data;
        if(!applicationData.StudentEvaluationArray) {
            applicationData.StudentEvaluationArray = [];
        }
        applicationData.StudentEvaluationArray.push(evaluation);
    },

    setGuestDaysRequested: function (completed, args) {
        var applicationData = this.first();

        if (applicationData) {
            applicationData = applicationData.raw || applicationData.data;
            applicationData.ApplicationType = args.form.baseParams.ApplicationType;
            for (var i = 0; i < applicationData.GenericResponseFormArray.length; i++) {
                var responseForm = applicationData.GenericResponseFormArray[i];
                if (responseForm.ResponseFormType == "GuestDays") {
                    responseForm.Complete = true;
                    this.flush(args);
                    break;
                }
            }
        }
    },

    getGuestDaysRequested: function () {
        var applicationData = this.first();
        if (applicationData) {
            applicationData = applicationData.raw || applicationData.data;
            for (var i = 0; applicationData.GenericResponseFormArray && i < applicationData.GenericResponseFormArray.length; i++) {
                var responseForm = applicationData.GenericResponseFormArray[i];
                if (responseForm.ResponseFormType == "GuestDays") {
                    return responseForm.Complete;
                }
            }
        }
    },

    getApplicationIsNew: function () {
        var applicationData = this.first();
        if (applicationData) {
            applicationData = applicationData.raw;
            return (!applicationData.Status);
        }
    },

    getApplicationData: function() {
        var applicationData = this.first();
        if(applicationData) {
            return applicationData = applicationData.raw || applicationData.data;

        }
    },

    /**
     * Writes app data back to the server.
     * @param args
     */
    flush: function (args) {
        var selfy = this;
        var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg: "Saving your application.  Please wait..."});
        loadMask.show();
        //Some things pass in a different object for the form.
        //This sucks but here is a way to figure out what is actually the form.
        var form = args.form.url ? args.form : args.form.down("form").getForm();
        var notifyParams = args.notifyParams || {};
        //Flushes the cached form applicationData.
        delete form._fields;

        var applicationData = {};
        var firstApp = this.first();
        if (firstApp) {
            //Populate the submit data with that
            //that's already in the store if this is an existing application.
            applicationData = firstApp.raw || firstApp.data;
        }
        //Its a new application.  The creator is the owner.
        //The field have the same reference so its also in the
        //submission data
        if (!applicationData.OwnerId) {
            //TODO doing it this way will allow the user to specify groups they
            //want to be in.  This needs to be protected.  Its very bad.
            var owner = Lumen.getApplication().getAuthenticationStore().first().raw;
            applicationData.OwnerId = owner["_id"]["$id"];
        }

        var callback = function (response) {
            loadMask.hide();
            if(response.responseText.trim()) {
                var admissionApplicationResponse = Ext.decode(response.responseText);
                //applicationData.Id = admissionApplicationResponse.applicationData.Id;
                //TODO hack to associate saved GuestDays form with a new app.... pretty much the same hack as above.
                // applicationData.GenericResponseFormArray[0].Id = admissionApplicationResponse.applicationData.GenericResponseFormArray[0].Id;
                Ext.merge(applicationData, admissionApplicationResponse.applicationData);

                Lumen.getApplication().fireEvent(Lumen.ADMISSION_APPLICATION_SAVED);
                if (args.callback) {
                    args.callback(admissionApplicationResponse);
                    if (args.applicationSubmitted) {

                    }
                }
                Lumen.getApplication().getAdmissionApplicationListStore().load({
                    params: {
                        ownerId: Lumen.ownerId
                    }
                });
            }
        }

        Ext.apply(applicationData, form.baseParams);
        var jsonData = Ext.encode(applicationData);

        Ext.Ajax.request({
            url: form.url,
            params: {
                formData: jsonData,
                notifyParams: notifyParams,
                applicationSubmitted: args.applicationSubmitted
            },
            method: "POST",
            context: this,
            failure: function (response) {
                callback(response);
                loadMask.hide();
            },
            success: function (response, opts) {
                callback(response);
            }
        });

    },

    getFields: function () {
        return this.fields;
    },
    sorters: [
        {
            property: 'firstName',
            direction: 'DESC'
        }
    ]
});