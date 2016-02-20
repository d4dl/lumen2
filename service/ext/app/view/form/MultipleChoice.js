Ext.define('Lumen.view.form.MultipleChoice', {
    QuestionResponse: null,
    constructor: function(config) {
        if(config.namePrefix) {
            this.namePrefix = config.namePrefix;
        } else {
            this.namePrefix = "";
        }
        this.query = config.query;
        this.callParent(arguments);
    },

    getOutputValue: function () {
        var output = "";
        //Two scenarios.  This one is for multiple choices that reuse the multiple choice logic
        //but aren't actually Questions.
        if (typeof this.QuestionResponse !== "undefined") {
            if (this.useDataItemKey && this.dataItemKey && this.QuestionResponse[this.dataItemKey]) {
                var selectorKey = this.getSelectorKey(this.question, this.QuestionResponse[this.dataItemKey], this.dataItemIdentifier, this.dataItemKey, this.namePrefix);

                var itemsToSelect = this.query("[selectorKey=" + selectorKey + "]");
                for (var i = 0; i < itemsToSelect.length; i++) {
                    if (itemsToSelect[i].getValue()) {
                        output += itemsToSelect[i].fieldLabel ? itemsToSelect[i].fieldLabel : itemsToSelect[i].boxLabel;
                    }
                }
            } else if (!this.useDataItemKey) {
                //Go through each form item real QuestionResponses.
                for (var j = 0; j < this.subQuestionItems.length; j++) {
                    var subQuestionItem = this.subQuestionItems[j];
                    var responseValue = this.getResponseValue(subQuestionItem.inputValue);
                    var selectorKey = this.getSelectorKey(this.question, subQuestionItem.inputValue, this.dataItemIdentifier, this.dataItemKey, this.namePrefix);
                    var selector = "[selectorKey=" + selectorKey + "]";
                    var subQuestionComponent = this.query(selector)[0];
                    if (subQuestionComponent.getValue()) {
                        output += responseValue.ResponseChoice.ChoiceValue + "<br/>";
                    }
                }
            }
        }
        return output ? output : "";
    },

    setQuestionResponse: function(QuestionResponse, choiceContainerComponent, renderForPrint, readOnly, hideData) {
        //Lumen.log("Setting question rea");
        if(!choiceContainerComponent) {
            choiceContainerComponent = this;
        }
        this.QuestionResponse = QuestionResponse;

        if(!this.QuestionResponse.ResponseValueArray) {
            this.QuestionResponse.ResponseValueArray = [];
        }
        //Two scenarios.  This one is for multiple choices that reuse the multiple choice logic
        //but aren't actually Questions.
        if(this.useDataItemKey && this.dataItemKey && QuestionResponse[this.dataItemKey]) {
            var selectorKey = this.getSelectorKey(this.question, QuestionResponse[this.dataItemKey], this.dataItemIdentifier, this.dataItemKey, this.namePrefix);

            var itemsToSelect = choiceContainerComponent.query("[selectorKey="+selectorKey+"]");
            for(var i=0; i < itemsToSelect.length; i++) {
                if(!hideData) {
                    itemsToSelect[i].setValue(true);
                }
                itemsToSelect[i].setReadOnly(readOnly);
                itemsToSelect[i].setDisabled(readOnly);
            }
        } else if (!this.useDataItemKey){
            //Go through each form item real QuestionResponses.
            for(var j=0; j <  this.subQuestionItems.length; j++) {
                var subQuestionItem = this.subQuestionItems[j];
                var responseValue = this.getResponseValue(subQuestionItem.inputValue);
                var selectorKey = this.getSelectorKey(this.question, subQuestionItem.inputValue, this.dataItemIdentifier, this.dataItemKey, this.namePrefix);
                var selector = "[selectorKey="+selectorKey+"]";
                var subQuestionComponent = choiceContainerComponent.query(selector)[0];
                //if(subQuestionComponent) {
                    subQuestionComponent.setReadOnly(readOnly);
                    subQuestionComponent.setDisabled(readOnly);
                    if(!hideData) {
                        if (responseValue) {
                            subQuestionComponent.setValue(true);
                        } else {
                            subQuestionComponent.setValue(false);
                        }
                    }
                //}
            }
        }
    },

    /**
     * Retrievs the responsevalue in the data set that has the ResponseChoice.ChoiceValue == responseChoiceText
     * @param responseChoiceText
     * @return {*}
     */
    getResponseValue:function (responseChoiceText) {
        //For the form item see if there's a value for it in the data.
        if(this.QuestionResponse && this.QuestionResponse.ResponseValueArray && this.QuestionResponse.ResponseValueArray.length > 0) {
            var responseValueArray = this.QuestionResponse.ResponseValueArray;
            for (var i = 0; i < responseValueArray.length; i++) {
                var ResponseValue = responseValueArray[i];
                if (ResponseValue.ResponseChoice.ChoiceValue == responseChoiceText) {
                    return ResponseValue;
                }
            }
        } else {
            return "";
        }
    },

    onChange: function (target, event, opts) {
        if(this.useDataItemKey && this.dataItemKey && target.getValue()) {
            this.QuestionResponse[this.dataItemKey] = target.inputValue;
        } else {//Two scenarios.
            var ResponseValue = this.getResponseValue(target.inputValue);
            if (target.getValue()) {
                if (!ResponseValue) { //The checkbox is checked.  Create a new value with the corresponding text or just make sure its not marked for deletion.
                    ResponseValue = {
                        ResponseChoice:{
                            ChoiceValue:target.inputValue
                        }
                    };
                    this.QuestionResponse.ResponseValueArray.push(ResponseValue);
                }
            } else if (ResponseValue) { //Its unchecked remove it from the array.
                for(var j=this.QuestionResponse.ResponseValueArray.length - 1; j >= 0; j--) {
                    var candidateResponseValue = this.QuestionResponse.ResponseValueArray[j]
                    if(candidateResponseValue.ResponseChoice.ChoiceValue == target.inputValue) {
                        this.QuestionResponse.ResponseValueArray.splice(j, 1);
                    }
                }
            }
        }
    },

    getSelectorKey: function(question, responseChoice, dataItemIdentifier, dataItemKey, namePrefix) {
        var name = (namePrefix ? namePrefix : "") + (question ? question : dataItemIdentifier) + "_" + dataItemKey;

        var toEncode = name +"_"+responseChoice;
        //Lumen.log("Getting field enc [" + toEncode);
        return new Lumen.controller.util.Base64().encode(toEncode.toLowerCase());
    },

    getFieldName: function(question, allowMultiple, index) {
        if(question) {
            return this.namePrefix + question.replace(/\W/g,"_") + (allowMultiple ? index : "")
        } else {
            return this.namePrefix + this.dataItemIdentifier + "_" + this.dataItemKey
        }
    },

    createSubQuestionItems:function (ResponseChoiceArray, question, allowMultiple, dataItemIdentifier, dataItemKey, namePrefix) {
        if(question == undefined) {
            question = this.question;
        }
        if(dataItemIdentifier == undefined) {
            dataItemIdentifier = this.dataItemIdentifier;
        }
        if(dataItemKey == undefined) {
            dataItemKey = this.dataItemKey;
        }

        this.namePrefix = namePrefix;
        //Lumen.log("Creating field questions");
        this.subQuestionItems = [];
        var self = this;
        for (var i = 0; i < ResponseChoiceArray.length; i++) {
            var ResponseChoiceText = ResponseChoiceArray[i];
            var selectorKey = this.getSelectorKey(question, ResponseChoiceText, dataItemIdentifier, dataItemKey, namePrefix);
            this.subQuestionItems.push({
                boxLabel:ResponseChoiceText,
                inputValue:ResponseChoiceText,
                selectorKey: selectorKey,
                description:"",
                name: this.getFieldName(question, allowMultiple, i)
//                listeners:{
//                    change: this.onChange,
//                    scope: this
//                }
            });
        }
        return this.subQuestionItems;
    }

});