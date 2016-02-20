Ext.define('Lumen.view.form.SurveyQuestionGrid', {
    extend: 'Lumen.view.form.QuestionResponseFormFieldSet',
    requires: ["Lumen.view.form.MultipleChoice"],
    collapsible: false,
    border: false,
    alias: 'widget.surveyquestiongrid',
    multipleChoiceEntries: null,
    constructor: function(config) {
        this.title = config.question;
        this.callParent([config]);
        this.addListener({afterrender: {
            fn: function() {
                Ext.select('tr:nth-child(even)', false, this.el.dom).addCls('even-row');
            }
        }});
    },
    layout: "fit",

    formDataVisitor: function(applicationData, renderForPrint, readOnly, hideData) {
        if(!applicationData.ResponseSet) {
            applicationData.ResponseSet = {
                QuestionResponseArray: []
            };
        }
        var QuestionResponseArray = applicationData.ResponseSet.QuestionResponseArray;
        for(var i=0; i < this.multipleChoiceEntries.length; i++) {
            var multipleChoiceEntry = this.multipleChoiceEntries[i];
            var QuestionResponse = this.getQuestionResponse(QuestionResponseArray, multipleChoiceEntry.question);
            if(!QuestionResponse) {
                QuestionResponse = {
                    Question: {
                        Label: this.multipleChoiceEntries[i].question
                    },
                    ResponseArray: []
                }
                QuestionResponseArray.push(QuestionResponse);
            }
            multipleChoiceEntry.setQuestionResponse(QuestionResponse, this, renderForPrint, readOnly, hideData);
        }
    },

    getQuestionResponse: function(QuestionResponseArray, questionLabel) {
        for(var i=0; i < QuestionResponseArray.length; i++) {
            var QuestionResponse = QuestionResponseArray[i];
            if(QuestionResponse.Question && QuestionResponse.Question.Label && QuestionResponse.Question.Label == questionLabel) {
                return QuestionResponse;
            }
        }
        return null;
    },


    getOutputHtml: function() {
        // throw new Error("This must be overridden.");
        var domHelper = Ext.DomHelper; // create shorthand alias

        var responseTable = domHelper.insertHtml("afterBegin", Ext.getBody().dom, "<table class='x-hidden'></table>");
        var tableBody = domHelper.insertHtml("afterBegin", responseTable, "<tbody></tbody>");
        for(var i=0; i < this.multipleChoiceEntries.length; i++) {
            var multipleChoiceEntry = this.multipleChoiceEntries[i];
            var questionRow  = domHelper.insertHtml("beforeEnd", tableBody, "<tr class='questionRow'></tr>");
            var cell         = domHelper.insertHtml("beforeEnd", questionRow, "<td class='question'></td>");
            var questionSpan = domHelper.insertHtml("beforeEnd", cell, "<span class='questionSpan'>" + multipleChoiceEntry.question + "</span>");
            var responses = multipleChoiceEntry.getOutputValue()

            var subQuestionItems = multipleChoiceEntry.subQuestionItems;
            for(var j=0; j < subQuestionItems.length; j++) {
                var subItem = subQuestionItems[j];
                cell = domHelper.insertHtml("beforeEnd", questionRow, "<td class='questionAnswer'></td>");
                var questionResponse = domHelper.insertHtml("beforeEnd", cell, "<span class='questionSpan'>" + subItem.inputValue + "</span>");
                var selected = responses.indexOf(subItem.inputValue) >= 0;
                if(selected) {
                    Ext.fly(questionResponse).addCls("selected");
                } else {
                    Ext.fly(questionResponse).addCls("notSelected");
                }
            }
        }

        var markup = "<table class='surveyQuestionGrid'>" + Ext.fly(responseTable).getHTML() + "</table>";
        return markup;
    },


    setDataItem: function(questionResponse, renderForPrint, readOnly, hideData) {
        var questionResponse = questionResponse;
        for(var i=0; i < this.multipleChoiceEntries.length; i++) {
            this.multipleChoiceEntries[i].setQuestionResponse(questionResponse, this, renderForPrint, readOnly, hideData);
        }
    },

    createFormItems: function(config) {
        var defaults = config.defaults;
        var questions = config.questions
        var self = this;
        this.multipleChoiceEntries = [];
        var subQuestionItems = [];
        for(var questionIndex=0; questionIndex < questions.length; questionIndex++) {

            var question = questions[questionIndex];
            var multipleChoice = Ext.create("Lumen.view.form.MultipleChoice", {
                ResponseChoiceArray: question.ResponseChoiceArray || defaults.ResponseChoiceArray,
                allowMultiple: question.allowMultiple,

                query : function(selector) {
                    selector = selector || '*';
                    return Ext.ComponentQuery.query(selector, self);
                }
            });
            multipleChoice.question = question.question;

            subQuestionItems.push(Ext.create("Ext.form.field.Display",{
                fieldLabel: question.question,
                selectorKey: new Lumen.controller.util.Base64().encode(question.name)
            }));
            var otherItems = multipleChoice.createSubQuestionItems(question.items || defaults.items, question.name, config.allowMultiple);
            subQuestionItems = subQuestionItems.concat(otherItems);

            this.multipleChoiceEntries.push(multipleChoice);
        }
        var items = [
            {
                xtype: "panel",
                layout: {
                    type: "table",
                    columns: defaults.items.length + 1//Length of the choices plus 1 for the question label
                },
                //align: "stretch",
                defaults: {
                    xtype: config.allowMultiple ? "checkbox" : "radio",
                    fieldCls: 'compactRadio',
                    labelCls: 'compactLabel',
                    boxLabelCls: 'compactLabel'
                },
                items: subQuestionItems
            }
        ];

        return items;
    }
});