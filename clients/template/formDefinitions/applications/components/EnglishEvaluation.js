[
    {
        xtype: "evaluationform",
        title: Lumen.i18n("Invitation to complete an English Evaluation"),
        itemId: "englishEvaluationPanel",
        items: [
            {
                xtype: 'component',
                html: "<div class='instructions'>Enter the teacher's name and email address to invite the teacher to complete the evaluation.</div><div class='invalidText'></div>"
            },
            {
                xtype: 'textfield',
                fieldLabel: "Teacher's Name",
                isValidEvaluationField: 'maybe',
                itemId: "teacherNameField",
                allowBlank: false
            },
            {
                xtype: 'textfield',
                fieldLabel: "Teacher's Email Address",
                isValidEvaluationField: 'maybe',
                allowBlank: false,
                vtype: "email",
                itemId: "notifyField"
            },
            {
                xtype: "button",
                text: "Send invitation",
                listeners: {
                    beforerender: function (scope) {
                        this.addListener({
                            scope: this,
                            click: function () {
                                var form = Lumen.getApplication().applicationForm;
                                var evaluationContainer = scope.ownerCt.ownerCt.queryById("englishEvaluationPanel");
                                if(evaluationContainer.invitationIsValid()) {
                                    Lumen.getApplication().fireEvent(Lumen.SEND_EVALUATION, {
                                        evaluationPanel: "englishEvaluationPanel",
                                        emailTitle: "English Evaluation",
                                        subject: Lumen.i18n('Name of School')+" Admission Application Evaluation",
                                        templateURL: Lumen.URL_EVALUATION_EMAIL_TEMPLATE,
                                        notify: scope.ownerCt.queryById("notifyField").getValue(),
                                        teacherName: scope.ownerCt.queryById("teacherNameField").getValue(),
                                        applicationId: Lumen.getApplication().getApplicationId(),
                                        evaluationType: "English"
                                    }, {
                                        container: evaluationContainer,
                                        form: form.down('form').getForm()
                                    });
                                }
                            }
                        });
                    }
                }
            }
        ]
    }
]