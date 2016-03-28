var pluginExpanded = true;
var grid = Ext.define('Lumen.view.AdmissionApplicationGrid', {
    extend: "Ext.grid.Panel",
    minHeight: 377,
    width: "100%",
    frame: true,
    title: 'Admission Applications',
    store: "Student",
    disableSelection: true,
    loadMask: true,
    autoDestroy: true,
    pageSize: 10,
    loadOptions: {
        criteria: JSON.stringify([{
            name: "status",
            value: "lead",
            conjunction: "and"
        }]),
        loadDebitSchedules: false
    },

    viewConfig: {
        trackOver: false,
        stripeRows: true
    },
    listeners: {
        afterrender: {
            fn: function (grid) {
                grid.getStore().getProxy().extraParams = grid.loadOptions;
                grid.getStore().load();
            }
        }
    },
    refresh: function (options) {
        this.getStore().removeAll();
        this.getStore().getProxy().extraParams = this.loadOptions;
        this.getStore().load();
    },
    // grid columns
    constructor: function () {
        var self = this;
        var store = Ext.data.StoreManager.lookup('Student');
        store.on("datachanged", function () {
        });
        this.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: "Student",
                dock: 'bottom',
                pageSize: 10, // items per page
                displayInfo: true
            },
            /**
            {
                dock: 'top',
                xtype: 'toolbar',
                items: [
                    {
                        width: 400,
                        fieldLabel: 'Search',
                        labelWidth: 120,
                        xtype: 'searchfield',
                        store: store
                    }
                ]
            }
             **/
        ];
        this.columns = [
            {
                xtype: 'actioncolumn',
                width: 32,
                icon: Lumen.IMAGES_URL_ROOT + '/icons/view.png',
                tooltip: 'View Application',
                handler: function (grid, rowIndex, colIndex) {
                    var person = grid.getStore().getAt(rowIndex);
                    Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM, {
                        person: person,
                        type: "AdmissionApplication"
                    })
                }
            },
            //        {
            //            xtype:'actioncolumn',
            //            width:32,
            //            icon: Lumen.IMAGES_URL_ROOT + 'printer.png',
            //            tooltip: 'View Printable Version',
            //            handler: function(grid, rowIndex, colIndex) {
            //                var record = grid.getStore().getAt(rowIndex);
            //                Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM, {applicationId: record.getId(), renderForPrint: true})
            //            }
            //        },
            {
                text: "First name",
                dataIndex: 'firstName',
                flex: 1,
                sortable: true
            },
            {
                text: "Last name",
                dataIndex: 'lastName',
                width: 200,
                sortable: true
            },
            {
                text: "Age",
                dataIndex: 'age',
                width: 100,
                sortable: false
            },
            {
                text: Lumen.i18n("Grade"),
                dataIndex: 'schoolAttributes.level',
                width: 80,
                sortable: false
            },
            {
                text: "Amount Paid",
                dataIndex: 'AmountPaid',
                flex: 1,
                sortable: false
            },
            {
                text: "Date Submitted",
                dataIndex: 'DateSubmitted',
                xtype: 'datecolumn',
                format: 'M-d-Y H:i',
                renderer: function (value, cell, model, index) {
                    if (value) {
                        var data = new Date();
                        if (value < 10000000000) {
                            value = value * 1000;
                        }
                        data.setTime(value);
                        return Ext.util.Format.date(data, 'M-d-Y H:i');
                    } else {
                        return "";
                    }
                },
                width: 140,
                sortable: false
            }
            ,
            {
                text: "Status",
                dataIndex: 'applicationStatus',
                width: 100,
                sortable: false
            }
        ];
        this.callParent(arguments);
        this.getStore().getProxy().extraParams = this.loadOptions;
    }
});