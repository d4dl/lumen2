Ext.define('Lumen.view.form.DataFormFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.dataformfieldset',
    //requires: ["Lumen.view.form.DataFormFieldMixin"],

    getOutputLabel: function() {
        return '<div class="outputLabel">'+this.title+'</div>';
    },
    constructor: function(config) {
        if(this.createFormItems) {
            this.items = this.createFormItems(config);
        }
        if(config.instructions) {
            this.items.unshift({
                xtype: 'component',
                cls: 'fieldsetInstructions',
                html: "<span>" + config.instructions + "</span>"
            });
        }
        this.callParent(arguments);
    }
});