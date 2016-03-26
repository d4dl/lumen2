Ext.define('Lumen.view.finance.DebitScheduleEntry', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.debitscheduleentry',
    border: false,
    defaults: {
        labelCls: "entryLabel"
    },
    layout: {
        type: "table",
        columns: 3
    },
    initComponent: function() {
        this.items = [
            /**
            {
                xtype: "textfield",
                name: "debitType",
                width: 80,
                labelWidth: 35,
                disabled: this.readOnly,
                fieldLabel: "Type"
            },
             **/
            {
                xtype: "numberfield",
                name: "debitAmount",
                width: 150,
                labelWidth: 45,
                disabled: this.readOnly,
                fieldLabel: "Amount"
            },
            {
                xtype: "datefield",
                name: "dateToExecute",
                itemId: "dateToExecute",
                labelWidth: 40,
                disabled: this.readOnly,
                fieldLabel: "Due"
            },
            {
                xtype: "datefield",
                name: "executedDate",
                hidden: true,
                itemId: "executedDate",
                labelWidth: 40,
                disabled: this.readOnly,
                fieldLabel: "Paid"
            }

        ]
        this.callParent(arguments);
    },
    showPaidDate: function () {
        this.getComponent("executedDate").setVisible(true);
        this.getComponent("dateToExecute").setVisible(false);
    }
});