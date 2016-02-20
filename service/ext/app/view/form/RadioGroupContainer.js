Ext.define('Lumen.view.form.RadioGroupContainer', {
    extend: 'Ext.form.RadioGroup',
    alias: 'widget.radiogroupcontainer',
    cls: "radioGroupContainer",
    //Don't ever use this.  DELETE IT
    //Use bindable radiogroup
    constructor: function (config) {
        var configItems = config.items;
        for(var i=0; i < configItems.length; i++) {
            var configItem = configItems[i];
            configItem.name = config.name + configItem.name;
        }
        this.callParent(arguments);
    }
});