QUnit.test("hello test", function (assert) {
    //var store = Ext.data.StoreManager.lookup('AdmissionApplication');
    //Lumen.getApplication().fireEvent(Lumen.POPULATE_ADMISSION_APPLICATION_FORM, {formRoot: Lumen.getApplication()});

    var authenticationStore = Lumen.getApplication().getAdmissionApplicationStore();
    var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();
    var applicationData = null;
    var done = assert.async();
    suite1.initializeApplicationDataBySavingCleanApp(assert, function () {
        var gradeComponent = Ext.ComponentQuery.query('shortquestion[dataItemKey="Grade"]')[0];
        var birthDate = Ext.ComponentQuery.query('datequestion[dataItemKey="BirthDate"]')[0];
        gradeComponent.setValue("eight");
        birthDate.down("datefield").setValue("05/04/2005");
        suite1.expectedApplicationData.Grade = "eight";
        //suite1.expectedApplicationData.Age = 10;
        suite1.expectedApplicationData.Child.Person.BirthDate = new Date("05/04/2005").getTime();
        Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
            form: Lumen.getApplication().applicationForm,
            callback: function (response) {
                var applicationData = admissionApplicationStore.first().data;
                assert.deepEqual(applicationData, suite1.updateUpdatedDates(applicationData), "The Grade should have been added.");
                done();
            }
        });
    });

});

var suite1 = {
    expectedApplicationData: {},

    initializeApplicationDataBySavingCleanApp: function (assert, callback) {
        var self = this;
        var admissionApplicationStore = Lumen.getApplication().getAdmissionApplicationStore();
        Lumen.getApplication().on({
            INITIALIZE_USER_UI: function () {

                var contentUrl = "https://quickmit.net/clients/development/formDefinitions/applications/HSMSAdmissions.js";
                var params = {contentUrl: contentUrl, json: true};
                var newClient = Ext.create("Lumen.view.UIContent", {params: params});
                Lumen.getApplication().fireEvent(Lumen.REPLACE_MAIN_DISPLAY, {newClient: newClient});
                Lumen.getApplication().on({
                    UI_CONTENT_INITIALIZED: function (config) {
                        Lumen.getApplication().un("UI_CONTENT_INITIALIZED", this);
                        if (config.contentUrl == contentUrl) {
                            var applicationForm = Lumen.getApplication().applicationForm;
                            assert(admissionApplicationStore.count() == 1, "There should only be one application.");
                            self.expectedApplicationData = Ext.Object.merge({}, admissionApplicationStore.first().data);

                            Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
                                form: Lumen.getApplication().applicationForm,
                                applicationSubmitted: false,
                                callback: function (response) {
                                    var applicationData = admissionApplicationStore.first().data;
                                    self.addServerInitDataToLocalApplication(applicationData);
                                    assert.deepEqual(applicationData, self.expectedApplicationData, "These should both have been initialized to be the same.");
                                    callback(applicationData, applicationForm);
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    initializeApplicationDataByRequestingEvaluation: function (assert, callback) {
    },


    initializeApplicationDataByRequestionMockDaysWithFirstAndLast: function (assert, callback) {
    },


    initializeApplicationDataByPayingFeeWithFirstAndLast: function (assert, callback) {
    },


    initializeApplicationDataByUploadingDocsFirstAndLast: function (assert, callback) {

    },
    initializeApplicationDataByVerifyingAndSavingFirstAndLast: function (assert, callback) {

    },

    updateUpdatedDates: function (remoteData) {
        this.expectedApplicationData.Updated = remoteData.Updated;
        this.expectedApplicationData.Child.Updated = remoteData.Child.Updated;
        this.expectedApplicationData.Child.HasChildArray[0].Parental.Updated = remoteData.Child.HasChildArray[0].Parental.Updated;
        this.expectedApplicationData.Child.HasChildArray[1].Parental.Updated = remoteData.Child.HasChildArray[1].Parental.Updated;

        return this.expectedApplicationData;
    },

    /**
     * Takes things that the server adds to the application data and adds it to the local copy that
     * the test suite maintains for comparisons.
     * @return {*}
     */
    addServerInitDataToLocalApplication: function (remoteData) {
        this.expectedApplicationData.ApplicationType = "HSMSAdmissions";
        this.expectedApplicationData.Status = "Started";

        this.expectedApplicationData.Child.Created = remoteData.Child.Created;
        this.expectedApplicationData.Child["_id"] = remoteData.Child["_id"];
        this.expectedApplicationData.ChildId = remoteData.ChildId;
        this.expectedApplicationData.Created = remoteData.Created;
        this.expectedApplicationData.OwnerId = remoteData.OwnerId;
        this.expectedApplicationData.ChildId = remoteData.ChildId;
        this.expectedApplicationData.Child.HasChildArray[0].parentId = remoteData.Child.HasChildArray[0].parentId;
        this.expectedApplicationData.Child.HasChildArray[0].Parental.Created = remoteData.Child.HasChildArray[0].Parental.Created;
        this.expectedApplicationData.Child.HasChildArray[0].Parental['_id'] = remoteData.Child.HasChildArray[0].Parental['_id'];
        this.expectedApplicationData.Child.HasChildArray[1].parentId = remoteData.Child.HasChildArray[1].parentId;
        this.expectedApplicationData.Child.HasChildArray[1].Parental.Created = remoteData.Child.HasChildArray[1].Parental.Created;
        this.expectedApplicationData.Child.HasChildArray[1].Parental['_id'] = remoteData.Child.HasChildArray[1].Parental['_id'];
        this.expectedApplicationData._id = Ext.Object.merge({}, remoteData._id);

        return this.expectedApplicationData;
    }
}