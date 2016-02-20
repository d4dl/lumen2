[
    {
        xtype: "evaluationform",
        title: Lumen.i18n("Invitation to complete a Math Evaluation"),
        itemId: "mathEvaluationPanel",
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
                vtype: 'email',
                allowBlank: false,
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
                                var evaluationContainer = scope.ownerCt.ownerCt.queryById("mathEvaluationPanel");

                                if(evaluationContainer.invitationIsValid()) {
                                    Lumen.getApplication().fireEvent(Lumen.SEND_EVALUATION, {
                                        evaluationPanel: "mathEvaluationPanel",
                                        subject: Lumen.i18n('Name of School')+" Admission Application Evaluation",
                                        emailTitle: "Math Evaluation",
                                        templateURL: Lumen.URL_EVALUATION_EMAIL_TEMPLATE,
                                        notify: scope.ownerCt.queryById("notifyField").getValue(),
                                        teacherName: scope.ownerCt.queryById("teacherNameField").getValue(),
                                        applicationId: Lumen.getApplication().getApplicationId(),
                                        evaluationType: "Math"
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