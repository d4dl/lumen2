Ext.define('Lumen.view.finance.DebitSchedule', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.debitschedule',
    border: false,
    cls: "debitSchedule",
    defaults: {
        labelCls: "entryLabel"
    },
    initComponent: function() {
        this.items = [
            {
                xtype: "textfield",
                name: "name",
                disabled: this.readOnly,
                fieldLabel: "Plan:"
            },
            {
                xtype: "textarea",
                name: "description",
                disabled: this.readOnly,
                fieldLabel: "Description:"
            },
            {
                xtype: "numberfield",
                name: "downPaymentAmount",
                disabled: this.readOnly,
                fieldLabel: Lumen.i18n("Down Payment")
            }

        ]
        this.callParent(arguments);
    }
});