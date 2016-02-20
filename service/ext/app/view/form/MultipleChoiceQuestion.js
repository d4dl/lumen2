Ext.define('Lumen.view.form.MultipleChoiceQuestion', {
    extend: 'Lumen.view.form.QuestionResponseFormFieldSet',
    collapsible: true,
    cls: "multipleChoiceFieldSet",
    deprecate: true,
    subQuestionItems: null,
    //collapsed: true,
    alias: 'widget.multiplechoicequestion',
    collapsed: true,
    multipleChoiceQuestionHelper: null,

    mixins: {
        multipleChoiceMixin: "Lumen.view.form.MultipleChoice"
    },

    setDataItem: function(questionResponse, renderForPrint, readOnly, hideData) {
        this.questionResponse = questionResponse;
        return this.setQuestionResponse(questionResponse, null, renderForPrint, readOnly, hideData);
    },

    getOutputHtml: function() {
        return this.getOutputValue() + "<br/>";
    },

    createFormItems: function(config) {
        var question = config.question ? config.question : null;
        this.createSubQuestionItems(config.ResponseChoiceArray, question, config.allowMultiple, config.dataItemIdentifier, config.dataItemKey, config.namePrefix);
        var items = [
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3
                },
                align: "stretch",
                defaults: {
                    xtype: config.allowMultiple ? "checkbox" : "radio",
                    fieldBodyCls: "compactRadioWrap",
                    fieldCls: 'compactRadio',
                    labelCls: 'compactLabel',
                    boxLabelCls: 'compactBoxLabel',
                    labelAlign: "left",
                    padding: "2, 10",
                    fieldSubTpl: '<tpl if="boxLabel && boxLabelAlign == \'before\'">'+
                                 '{beforeBoxLabelTpl}'+
                                   '<label id="{cmpId}-boxLabelEl" {boxLabelAttrTpl} class="{boxLabelCls} {boxLabelCls}-{boxLabelAlign}" for="{id}">'+
                                       '{beforeBoxLabelTextTpl}'+
                                       '{boxLabel}'+
                                       '{afterBoxLabelTextTpl}'+
                                   '</label>'+
                                   '{afterBoxLabelTpl}'+
                               '</tpl>'+
                               // Creates not an actual checkbox+ but a button which is given aria role="checkbox" (If ARIA is required) and
                               // styled with a custom checkbox image. This allows greater control and consistency in
                               // styling+ and using a button allows it to gain focus and handle keyboard nav properly.
                               '<input type="button" id="{id}" {inputAttrTpl}'+
                                   '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>'+
                                   '<tpl if="disabled"> disabled="disabled"</tpl>'+
                                   '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>'+
                                   ' class="{fieldCls} {typeCls}" autocomplete="off" hidefocus="true" />'+
                               '<tpl if="boxLabel && boxLabelAlign == \'after\'">'+
                                   '{beforeBoxLabelTpl}'+
                                   '<div class="align quickmitspecial"><label id="{cmpId}-boxLabelEl" {boxLabelAttrTpl} class="{boxLabelCls} {boxLabelCls}-{boxLabelAlign}" for="{id}">'+
                                       '{beforeBoxLabelTextTpl}'+
                                       '{boxLabel}'+
                                       '{afterBoxLabelTextTpl}'+
                                   '</label></div>'+
                                   '{afterBoxLabelTpl}'+
                               '</tpl>'
                },
                items: this.subQuestionItems
            }
        ];
        return items;
    }

});
