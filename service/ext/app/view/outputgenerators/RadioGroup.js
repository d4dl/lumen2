Ext.define('Lumen.view.outputgenerators.RadioGroup', {
    extend: 'Lumen.view.outputgenerators.OutputGenerator',

    getOutputHtml: function (dataItem, dataItemKey, field) {
        var value = field.getValue();

        var output = "";
        //Two scenarios.  This one is for multiple choices that reuse the multiple choice logic
        //but aren't actually Questions.
        if (this.JSONPath.hasValue(value)) {
            var started = false;
            for(var key in value) {
                if(started) {
                    output += ", ";
                }
                output += value[key];
                started = true;
            }
        }
        return output ? output : Lumen.i18n("No Value");
    }

});