Ext.define('Lumen.view.form.ShortQuestion',{
    extend: 'Ext.form.field.Text',
    layout: "fit",
    flex: 1,
    collapsible: false,
    allowBlank: false,
    border: false,
    cls: "shortQuestion",
    labelSeparator: "",
    labelCls: "shortQuestionLabel",
    alias: 'widget.shortquestion',
   // width: 300,
    labelWidth: 130,


    setDataItem: function(questionResponse, renderForPrint, readOnly, hideData) {
        this.questionResponse = questionResponse;
        this.setReadOnly(readOnly);
        this.setDisabled(readOnly);

        if(this.useDataItemKey && this.dataItemKey) {
            this.setValue(this.questionResponse[this.dataItemKey]);
        } else {
            if(!this.questionResponse.ResponseValueArray) {
                this.questionResponse.ResponseValueArray = [{LongValue: ""}];
            }
            if(this.questionResponse.ResponseValueArray.length && this.questionResponse.ResponseValueArray[0].LongValue !== undefined) {
                if(!hideData) {
                    this.setValue(this.questionResponse.ResponseValueArray[0].LongValue);
                }
            }
        }
    },
    getOutputLabel: function() {
        // throw new Error("This must be overridden.");
        return "<span>" + this.fieldLabel + "</span>";
    },
    getOutputHtml: function() {
        if(!this.questionResponse || !this.questionResponse.ResponseValueArray || this.questionResponse.ResponseValueArray.length == 0) {
            return "";
        }
        function pad(n) {
            return n < 10 ? '0' + n : n
        }
        var data;
        if(this.useDataItemKey && this.dataItemKey) {
            data = this.questionResponse[this.dataItemKey];
        } else {
            data = this.questionResponse.ResponseValueArray[0].LongValue;
        }
        if(data instanceof Date) {
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
        }
        return data;
    }
});
