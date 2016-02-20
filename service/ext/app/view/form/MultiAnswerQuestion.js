Ext.define('Lumen.view.form.MultiAnswerQuestion', {
    extend: 'Lumen.view.form.DataFormFieldSet',
    collapsible: true,
    //collapsed: true,
    border: true,
    alias: 'widget.multianswerquestion',
    collapsed: true,
    cls: "multiAnswerQuestion",
    subQuestionItems: null,
    ResponseValueArray: null,//Server data
    //Deprecated don't use.
    //Use
    constructor: function(config) {
        this.items = this.createSubQuestionItems(config.subquestions, config.defaults, config.columns);
        this.JSONPath = new Lumen.controller.util.JSONPath();
        this.callParent(arguments);
    },

    setValue: function(responseValueArray) {
        for(var orderIndex=0; orderIndex <  responseValueArray.length; orderIndex++) {
            var ResponseValue = responseValueArray[orderIndex];
            if(ResponseValue) {
                this.query("[orderIndex='"+orderIndex+"']")[0].setValue(ResponseValue);
            }
        }
    },
    getValue: function(value) {
        var value = [];
        var fields = this.query("textfield");
        Ext.each(fields, function (item) {
            value.push(item.getRawValue(value));
        });
        return value;
    },

    /**
     * Creates this structure
     * [
     *   label1: ['value1', 'value2'],
     *   label2: ['', 'value4'],
     *   label3: [];no output for this
     * ]
     * This is done so order is preserved.
     * @return {Object}
     */
    createLabelResponseMap: function (dataItem, childPathPrefix, field) {
        var values = this.JSONPath.find(dataItem, childPathPrefix);
        values = Ext.isArray(values) ? values[0] : values;
        var responseValueMap = [];
        for (var labelIndex = 0; labelIndex < values.length; labelIndex++) {
            var value = values[labelIndex];
            var label = this.subQuestionItems[labelIndex].fieldLabel;
            var responseIndex = -1;
            for (var i = 0, len = responseValueMap.length; i < len; i++) {
                var keys = Object.keys(responseValueMap[i]);
                if(keys[0] == label) {
                    responseIndex = i;
                    break;
                }
            }
            var responseLabelMap = null;
            var values;
            if (responseIndex >= 0) {
                values = responseValueMap[responseIndex][label];
            } else {
                values = [];
                responseLabelMap = {};
                responseLabelMap[label] = values;
                responseValueMap.push(responseLabelMap);
            }

            values.push(value);
        }
        return responseValueMap;
    },

    getOutputHtml: function(dataItem, childPathPrefix, field) {
        var output = "";
        output += "<table>";
        function pad(n) {
            return n < 10 ? '0' + n : n
        }

        var responseValueMap = this.createLabelResponseMap(dataItem, childPathPrefix, field);
        output += "  <tr class='multiquestionvaluerow'>\n";
        for(var i=0; i < responseValueMap.length; i++) {
            var responseObject = responseValueMap[i];
            var label = Object.keys(responseObject)[0];
            //TODO how did the key 'undefined' make its way into this object?
            //TODO.  Instructions should be output in all getOutputHtml
            if(label != "undefined") {
                output += "    <th>"+ label +"</th>\n";
            }
        }
        output += "  </tr>\n";

        for (var rowIndex = 0; rowIndex < this.subQuestionItems.length; rowIndex++) {
            var currentRow = "  <tr class='multiquestionvaluerow'>\n";
            var valueSeen = false;
            for(var cellIndex = 0; cellIndex < responseValueMap.length; cellIndex++) {
                var responseObject = responseValueMap[cellIndex];
                var label = Object.keys(responseObject)[0];
                var value = responseObject[label][rowIndex];
                if(typeof(value) != 'undefined' && value !== "") {
                    valueSeen = true;
                }
                var questionResponseValue = responseValueMap[rowIndex];
                if(questionResponseValue instanceof Date) {
                    currentRow += "    <td>" + questionResponseValue.getUTCFullYear() + '-' +
                        pad(questionResponseValue.getUTCMonth() + 1) + '-' +
                        pad(questionResponseValue.getUTCDate()) + "</td>\n";
                } else {
                    currentRow += "    <td>" + (!!value ? value : "") + "</td>\n";
                }
            }
            currentRow += "  </tr>\n";
            if(valueSeen) {
                output += currentRow;
            }
            valueSeen = false;
        }
        output += "</table>"
        return output;
    },
    initComponent: function() {
        this.callParent(arguments);
        var self = this;
        var fields = this.query("textfield");
        Ext.each(fields, function (item) {
            item.on("change", function(textarea, newValue, oldValue, eOpts){
                self.fireEvent("change", textarea, newValue, oldValue, eOpts);
            });
        });
    },
    createSubQuestionItems: function (subquestions, defaults, columns) {
        var subquestionItems = [];
        for(var orderIndex=0; orderIndex <  subquestions.length; orderIndex++) {
            var subquestion = subquestions[orderIndex];
            var fieldClass = "middleInput";
            if(orderIndex % columns == 0) {
                fieldClass = "leftInput";
            } else if(orderIndex % columns == columns - 1) {
                fieldClass = "rightInput";
            }
            var subQuestionItem = {
                labelAlign: "top",
                fieldCls: fieldClass,
                inputValue: subquestion.name || subquestion.question,
                fieldLabel: subquestion.name ? Lumen.i18n(subquestion.name) : Lumen.i18n(subquestion.question),
                name: subquestion.name || subquestion.question,
                orderIndex: orderIndex
            };
            subquestionItems.push(subQuestionItem);
        }

        var items = [
            {
                xtype: "container",
                align: "stretch",
                layout: {
                    type: "table",
                    columns: columns
                },
                defaults: defaults,
                items: subquestionItems
            }
        ]
        this.subQuestionItems = subquestionItems;
        return items;
    }
});