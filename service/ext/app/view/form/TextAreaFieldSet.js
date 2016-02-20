Ext.define('Lumen.view.form.TextAreaFieldSet', {
    extend: 'Lumen.view.form.QuestionResponseFormFieldSet',
    collapsible: true,
    border: true,
    collapsed: true,
//    cls: "longQuestionFieldSet",
    cls: "formContent textareafieldset",
    alias: 'widget.textareafieldset',
    constructor: function(config) {
        this.items = [
            {
                cls: "longQuestionEditor",
                xtype: "textarea",
                height: 280
            }
        ];
        //doesn't work
//        if(config.defaults) {
//            Ext.apply(this.items[0], config.defaults);
//        }
        this.items[0].containingName = config.name;
        if(typeof config.allowBlank !== "undefined") {
            this.items[0].allowBlank = config.allowBlank;
        }
        if(config.inputHeight) {
            this.items[0].height = config.inputHeight;
        }
        if(config.inputWidth) {
            this.items[0].width = config.inputWidth;
        }
        this.callParent([config]);
    },
    initComponent: function() {
        this.callParent(arguments);
        var self = this;
        this.down("textarea").on("change", function(textarea, newValue, oldValue, eOpts){
            self.fireEvent("change", textarea, newValue, oldValue, eOpts);
        });
    },
    setValue: function(value) {
        this.down("textarea").setValue(value);
    },
    getValue: function(value) {
        return this.down("textarea").getRawValue(value);
    },
    setRawValue: function(value) {
        this.down("textarea").setRawValue(value);
    },
    setRenderObject: function(questionResponse, renderForPrint, readOnly, hideData) {
        this.questionResponse = questionResponse;
//        this.down("textarea").setReadOnly(readOnly);
//        this.down("textarea").setDisabled(readOnly);
//        if(!this.questionResponse.ResponseValueArray) {
//            this.questionResponse.ResponseValueArray = [{LongValue: ""}];
//        }
//        if(this.questionResponse.ResponseValueArray.length && this.questionResponse.ResponseValueArray[0].LongValue !== undefined) {
//            if(!hideData) {
//                this.down("textarea").setValue(this.questionResponse.ResponseValueArray[0].LongValue);
//            }
//        }
    },
    getOutputHtml: function() {
        var html = this.down("textarea").getValue();
        return html || "No Value";
    }
});