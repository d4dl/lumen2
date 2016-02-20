Ext.define('Lumen.view.outputgenerators.OutputGenerator',{
    border: false,
    cls: "shortQuestion",

    constructor: function() {
        this.JSONPath = new Lumen.controller.util.JSONPath();
    },

    getOutputLabel: function(dataItem, dataItemKey, field) {
        // throw new Error("This must be overridden.");
        var label = field.fieldLabel;
        if(!label) {
            label = field.boxLabel;
        }
        if(!label) {
            label = field.title;
        }
        if(!label) {
            label = Lumen.i18n(field.name);
        }
        return "<span>" + label + "</span>";
    },

    getOutputHtml: function(dataItem, dataItemKey, field) {
        var value = this.getValue(dataItem, dataItemKey);
        if(!value) {
            value = Lumen.i18n("No Value");
        }
        return value;
    },

    getValue: function (dataItem, dataItemKey) {
        var value = this.JSONPath.find(dataItem, dataItemKey);
        if (this.JSONPath.hasValue(value)) {
            value = Ext.isArray(value) && value.length == 0 ? value[0] : value;
        } else {
            value = "";
        }
        return value;
    },
    pad: function(n) {
        return n < 10 ? '0' + n : n
    }
});
