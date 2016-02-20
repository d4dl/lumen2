Ext.define('Lumen.view.finance.Fee', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fee',
    border: false,
    defaults: {
        labelCls: "entryLabel"
    },
    layout: {
        type: "table",
        columns: 2
    },
    initComponent: function() {
        this.items = [
            {
                xtype: "textfield",
                name: "name",
                width: 221,
                labelWidth: 45,
                disabled: this.readOnly,
                fieldLabel: "Fee"
            },
            {
                xtype: "numberfield",
                name: "amount",
                width: 120,
                labelWidth: 50,
                disabled: this.readOnly,
                fieldLabel: "Amount"
            }

        ]
        this.callParent(arguments);
    }
});