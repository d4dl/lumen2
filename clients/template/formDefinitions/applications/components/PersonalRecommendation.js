[
    {
        xtype: "evaluationform",
        title: "Invitation to complete a Personal Recommendation",
        itemId: "personalRecommendationPanel",
        required: true,
        items: [
            {
                xtype: 'component',
                html: "<div class='instructions'>Enter the name and email address to invite a personal contact to complete a personal recommendation. This should be an adult (non-family member) who has spent significant time with the student in the last year.</div><div class='invalidText'></div>"
            },
            {
                xtype: 'textfield',
                isValidEvaluationField: 'maybe',
                fieldLabel: "Recipient's Name",
                itemId: "teacherNameField",
                allowBlank: false
            },
            {
                xtype: 'textfield',
                isValidEvaluationField: 'maybe',
                fieldLabel: "Recipient's Email Address",
                itemId: "notifyField",
                allowBlank: false,
                vtype: "email"
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
                                var evaluationContainer = scope.ownerCt.ownerCt.queryById("personalRecommendationPanel");

                                if(evaluationContainer.invitationIsValid(evaluationContainer)) {
                                    Lumen.getApplication().fireEvent(Lumen.SEND_EVALUATION, {
                                        evaluationPanel: "personalRecommendationPanel",
                                        subject: Lumen.i18n('Name of School')+" Admission Application Evaluation",
                                        emailTitle: "Personal Recommendation",
                                        templateURL: Lumen.URL_EVALUATION_EMAIL_TEMPLATE,
                                        notify: scope.ownerCt.queryById("notifyField").getValue(),
                                        teacherName: scope.ownerCt.queryById("teacherNameField").getValue(),
                                        applicationId: Lumen.getApplication().getApplicationId(),
                                        evaluationType: "PersonalRecommendation"
                                    }, {
                                        container: evaluationContainer,
                                        form:  form.down('form').getForm()
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