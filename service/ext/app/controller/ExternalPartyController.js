Ext.define('Lumen.controller.ExternalPartyController',{
    extend: 'Ext.app.Controller',
    stores: ['Lumen.store.AdmissionApplication'],
    init: function (application) {
        application.on({
            "SEND_NOTIFICATION": this.sendNotification,
            "SEND_EVALUATION": this.sendEvaluation,
            "SAVE_JSON_ENTITY": this.saveJSONEntity,
            "LOAD_FAMILY_INFO": this.loadFamilyInfo,
            scope: this
        });
    },

    loadFamilyInfo: function(params, options) {
    },

    saveJSONEntity: function(params, options) {
        Ext.Ajax.request({
            url: Lumen.DATA_SERVICE_URL_ROOT + "/documentService.php",
            params: params,
            method: "POST",
            context: this,
            failure: function (response) {
                var popup = Ext.widget('window',{
                    title: 'An error occurred',
                    modal: true,
                    html: "Our apologies.  An error occurred.  Please try again later.",
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
            },
            success: function (response, opts) {
                if(params.callback) {
                    params.callback(JSON.parse(response.responseText));
                } else if(params.container && response.responseText) { //This functionality was invented and there were only evaluation notifications.
                    //It needs to be genericized but right now, this parameter indicates that its an evaluation notification.
                    var popup = Ext.widget('window',{
                        title: 'Thank you',
                        modal: true,
                        html: Lumen.I18N_LABELS.yourEvaluationInvitationHasBeenSent,
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
                    //This already should be taken care of.
                    //                    var responseData = JSON.parse(response.responseText);
                    //                    Lumen.getApplication().fireEvent(Lumen.ADD_EVALUATION, {evaluationData: responseData.evaluation,
                    //                        parentContainer: params.container,
                    //                        renderForPrint: false,
                    //                        collapsed: true});
                }
            }
        });
    },

    sendEvaluation: function(params, options) {
        var self = this;
            var uid = new Ext.data.UuidGenerator().generate();
        var evaluation = {
            Panel: params.evaluationPanel,
            TeacherName: params.teacherName,
            EvaluationType: params.evaluationType,
            UID: uid, //Single use for the client since the id the server will create is unknown.
            Email: params.notify
        }
        Lumen.getApplication().addStudentEvaluation(evaluation);
        Lumen.getApplication().fireEvent(Lumen.JSON_PATH_FORM_SUBMIT, {
            form: options.form,
            callback: function (application) {
                params.evaluationId = self.findEvaluationIdForUID(uid, application.applicationData)
                if(!params.applicationId) {
                    params.applicationId = Lumen.getApplication().getApplicationId();
                }
                self.sendNotification({
                    container: options.container,
                    notifyParams: params
                });
            }
        });
    },

    sendNotification: function (params, options) {
        Ext.Ajax.request({
            url: Lumen.DATA_SERVICE_URL_ROOT + "/notifyService.php",
            params: {notifyParams: JSON.stringify(params.notifyParams)},
            method: "POST",
            context: this,
            failure: function (response) {
                var popup = Ext.widget('window',{
                    title: 'An error occurred',
                    modal: true,
                    html: "Our apologies.  An error occurred.  Please try again later.",
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
            },
            success: function (response, opts) {

                if(params.container) { //This functionality was invented and there were only evaluation notifications.
                    //It needs to be genericized but right now, this parameter indicates that its an evaluation notification.
                    var popup = Ext.widget('window',{
                        title: 'Thank you',
                        modal: true,
                        html: Lumen.I18N_LABELS.yourEvaluationInvitationHasBeenSent,
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
                    //This already should be taken care of.
//                    var responseData = JSON.parse(response.responseText);
//                    Lumen.getApplication().fireEvent(Lumen.ADD_EVALUATION, {evaluationData: responseData.evaluation,
//                        parentContainer: params.container,
//                        renderForPrint: false,
//                        collapsed: true});
                }
            }
        });
    },


    findEvaluationIdForUID: function(uid, application) {
        var studentEvaluations = application.StudentEvaluationArray;
        for(var i=0; i < studentEvaluations.length; i++) {
            var studentEvaluation = studentEvaluations[i];
            if(studentEvaluation['UID'] == uid) {
                return studentEvaluation['_id'];
            }
        }
    }
});