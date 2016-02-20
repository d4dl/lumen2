Ext.define('Lumen.view.outputgenerators.Date', {
    extend: 'Lumen.view.outputgenerators.OutputGenerator',

    getOutputHtml: function (dataItem, dataItemKey, field) {
        var value = field.getValue();
        if(value) {
            var output = value.getUTCFullYear() + '-' + this.pad(value.getUTCMonth() + 1) + '-' + this.pad(value.getUTCDate());
        }

        return output ? output : Lumen.i18n("No Value");
    }

});