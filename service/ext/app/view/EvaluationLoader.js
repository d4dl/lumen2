Ext.define('Lumen.view.EvaluationLoader',{
    extend: 'Ext.container.Container',
    layout: 'fit',
    renderTo: "lumenbody",
    itemId: "teacherEvaluationForm",
    //width: 910,
    constructor: function(config) {
        Lumen.BYPASS_WARNING = true;
        this.callParent(config);
    },
    items: [
        {
            itemId: "titleItem",
            xtype: "component",
            cls: 'evaluationTitle',
            setEvaluationTitle: function(studentName) {
                this.getEl().setHTML( "<span class='bigHeader'>"+ Lumen.I18N_LABELS.evaluationHeaderTitle + "<span class='studentName'>" + studentName+"</span></span>");
            }
        },
        {
            itemId: "instructionItem",
            cls: "evaluationInstructions",
            xtype: "component",
            html: Lumen.I18N_PROMPTS.evaluationinstruction
        },
        {
            autoHeight: true,
            itemId: 'surveyForm',
            xtype: 'form',
            cls: 'surveyForm',
            frame: true,
            url: Lumen.DATA_SERVICE_URL_ROOT + "/evaluationService.php",
            title: "Student Survey",
            //width: 910,

            listeners: {
                afterrender: function(component) {
                    Ext.Ajax.request({
                        url: Lumen.DATA_SERVICE_URL_ROOT + "/evaluationService.php",
                        params: {formData: Ext.encode({accessCode: new Lumen.controller.util.QueryData().get('accessCode'), load: true})},
                        method: "POST",
                        failure: function (response) {
                            alert("error");
                            //TODO put an error popup in all failure functions
                            //Along with a notification
                        },
                        success: function (response) {
                            var parentComponent = component.up("#teacherEvaluationForm");
                            var evaluationResponseData = JSON.parse(response.responseText);
                            parentComponent.evaluationData = evaluationResponseData.StudentEvaluationArray;
                            var studentName = evaluationResponseData.FirstName + " " + evaluationResponseData.LastName;
                            var applicantStore = Ext.data.StoreManager.lookup('Lumen.store.Applicant');
                            applicantStore.loadRawData([evaluationResponseData.Child]);
                            parentComponent.studentName = studentName;
                            parentComponent.parentEmail = evaluationResponseData.ParentEmail;
                            parentComponent.teacherName = evaluationResponseData.StudentEvaluationArray[0].TeacherName;
                            component.ownerCt.queryById("titleItem").setEvaluationTitle(studentName);
                            for(var i=0; i < parentComponent.evaluationData.length; i++) {
                                Lumen.getApplication().fireEvent(Lumen.ADD_EVALUATION,{evaluationData: parentComponent.evaluationData[i],
                                    parentContainer: component,
                                    renderForPrint: false,
                                    collapsed: false})
                            }
                        }
                    });
//                    var form = component.getForm();
                    component.add(Ext.create("Ext.form.field.Hidden",{name: "save", value: "true"}));
                    component.add(Ext.create("Ext.form.field.Hidden",{name: "accessCode", value: new Lumen.controller.util.QueryData().get('accessCode')}));
                    component.add(Ext.create("Ext.form.field.Hidden",{name: "teacherTemplate", value: Lumen.URL_TEACHER_TEMPLATE}));
                    component.add(Ext.create("Ext.form.field.Hidden",{name: "parentTemplate", value: Lumen.URL_PARENT_TEMPLATE}));
                    component.add(Ext.create("Ext.form.field.Hidden",{name: "adminTemplate", value: Lumen.URL_ADMIN_TEMPLATE}));
                },
                resize: {
                    fn: function(container, width, height, oldWidth, oldHeight, eOpts) {
                        Lumen.log("Inside ifram changing size. New height: " + height);
                        var params = {
                            method: "resizeOuterIframe",
                            height: height + 62
                        }
                        window.parent.postMessage(Ext.encode(params), "*");
                    }
                }
            },
            buttons: [
                {
                    text: 'Submit',
                    handler: function () {
                        //The button's toolbar's application
                        var form = this.up('form').getForm();
                        var evaluationForm = this.up("#teacherEvaluationForm");
                        var surveyForm = evaluationForm.down('#surveyForm');
                        var skipValidation = new Lumen.controller.util.QueryData().get("skipValidation");
                        var fieldSetComponentHtml = new Lumen.controller.util.HtmlExtractor().extractApplicationHtml(surveyForm);

                        if (form.isValid()) {
                            Lumen.getApplication().fireEvent(Lumen.EVALUATION_FORM_SUBMIT,{
                                form: form,
                                evaluationForm: evaluationForm,
                                fieldSetComponentHtml: fieldSetComponentHtml,
                                callback: function(){
                                    var popup = Ext.widget('window',{
                                        title: Lumen.I18N_LABELS.surveyCompleteWindowTitle,
                                        html: Lumen.I18N_LABELS.surveyCompleteWindowMessage,
                                        modal: true,
                                        width: 350,
                                        height: 120,
                                        bodyStyle: 'padding: 10px 20px;',
                                        autoScroll: true,

                                        buttons: [
                                            {
                                                text: 'Ok',
                                                handler: function () {
                                                    var params = {
                                                        method: "relocate",
                                                        url: Lumen.CLIENT_URL
                                                    }
                                                    window.parent.postMessage(Ext.encode(params), "*");                                                }
                                            }
                                        ]
                                    });

                                    popup.show();

                                }

                            });
                        } else {
                            var popup = Ext.widget('window',{
                                title: 'Incomplete Survey',
                                modal: true,
                                html: "Some fields have not been completed.  Please complete the field highlighted in red.",
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
                    }
                }
            ]
        }
    ]
});
