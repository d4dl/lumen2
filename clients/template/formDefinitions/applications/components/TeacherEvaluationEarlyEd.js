[
    {
        xtype:"evaluationform",
        title: Lumen.i18n("Invitation to complete a student Evaluation"),
        evaluationPanel:"teacherEvaluationPanel",
        itemId:"teacherEvaluationPanel",
        required: false,
        items:[
            {
                xtype:'component',
                html:"<div class='instructions'>Choose the type of evaluation.  Enter the teacher's name and email address to invite the teacher to complete the evaluation.</div><div class='invalidText'></div>"
            },
            Ext.create('Ext.form.ComboBox', {
                itemId:"earlyEdEvaluationTypeSelector",
                width:300,
                isValidEvaluationField: 'maybe',
                fieldLabel:'Evaluation type',
                store:Ext.create('Ext.data.Store', {
                    fields:['description', 'type'],
                    data:[
                        {"description":"Primary", "type":"Primary (3-5 years)"},
                        {"description":"Elementary", "type":"Elementary (K-5th grade)"}

                    ]
                }),
                queryMode:'local',
                displayField:'type',
                valueField:'description',
                allowBlank: false
            }),
            {
                xtype:'textfield',
                isValidEvaluationField: 'maybe',
                fieldLabel:"Teacher's Name",
                itemId:"teacherNameField",
                allowBlank: false
            },
            {
                xtype:'textfield',
                fieldLabel:"Teacher's Email Address",
                isValidEvaluationField: 'maybe',
                vtype: 'email',
                itemId:"notifyField" ,
                allowBlank: false
            },
            {
                xtype:"button",
                text:"Send invitation",
                listeners:{
                    beforerender:function (scope) {
                        this.addListener({
                            scope:this,
                            click:function () {
                                var form = Lumen.getApplication().applicationForm;
                                var evaluationContainer = scope.ownerCt.ownerCt.ownerCt.queryById("teacherEvaluationPanel");

                                if(evaluationContainer.invitationIsValid()) {
                                    //scope is the button. ownerCt is the form.  Used to get the selector
                                    var typeSelector = scope.ownerCt.getComponent("earlyEdEvaluationTypeSelector");

                                    var value = typeSelector.getValue();
                                    var description = "Primary School Evaluation";
                                    if (value == "Elementary") {
                                        description = "Elementary School Evaluation"
                                    }
                                    Lumen.getApplication().fireEvent(Lumen.SEND_EVALUATION, {
                                        evaluationPanel:"teacherEvaluationPanel",
                                        subject: Lumen.i18n('Name of School')+" Admission Application Evaluation",
                                        emailTitle:description,
                                        templateURL:Lumen.URL_EVALUATION_EMAIL_TEMPLATE,
                                        notify:scope.ownerCt.queryById("notifyField").getValue(),
                                        teacherName:scope.ownerCt.queryById("teacherNameField").getValue(),
                                        applicationId:Lumen.getApplication().getApplicationId(),
                                        evaluationType:value
                                    }, {
                                        container: evaluationContainer,
                                        form:form.down('form').getForm()
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