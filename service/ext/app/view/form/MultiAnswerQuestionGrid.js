Ext.define('Lumen.view.form.MultiAnswerQuestionGrid', {
    extend: 'Lumen.view.form.MultipleChoiceQuestion',
    //collapsed: true,
    cls: "longQuestionFieldSet",
    alias: 'widget.multianswerquestiongrid',
    collapsed: true,
    constructor: function(config) {
        if(typeof config.allowMultiple === "undefined") {
            config.allowMultiple = true;
        }
        this.callParent([config]);
    },

    createFormItems: function(config) {
        var subQuestionItems = this.createSubQuestionItems(config, config.question, config.allowMultiple);
        var headerItems = [];

        for (var i = 0; i < config.headers.length; i++) {
            var header = config.headers[i];
            headerItems.push({
                xtype:"displayfield",
//                selectorKey: new Lumen.controller.util.Base64().encode(header.label),
                value:header.label
            });
        }

        var subItems = headerItems.concat(subQuestionItems);

        var items = [
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: config.columns
                },
                align: "stretch",
                defaults: {
                    xtype: "checkbox"
                },
                items: subItems
            }
        ]
        this.subQuestionItems = subQuestionItems;
        return subQuestionItems;
    }
});