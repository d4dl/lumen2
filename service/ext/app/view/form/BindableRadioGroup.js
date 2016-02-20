Ext.define('Lumen.view.form.BindableRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    alias: 'widget.bindableradiogroup',
    cls: "radioGroupContainer",
    invalidCls: "invalidGroup",
    mixins: {
        fieldGroupMixin: Lumen.view.form.FieldGroupMixin
    },
    onAdded: function() {
        this.callParent(arguments);
        this.mixins.fieldGroupMixin.onAdded.call(this);
    },
    getValue: function() {
        return this.mixins.fieldGroupMixin.getValue.call(this);
    },
    setValue: function(value) {
        this.mixins.fieldGroupMixin.setValue.call(this, value);
        return this;
    }
});