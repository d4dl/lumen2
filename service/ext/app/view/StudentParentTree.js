var pluginExpanded = true;
var grid = Ext.define('Lumen.view.StudentParentTree', {
    extend: "Ext.grid.Panel",
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn'
    ],
//    plugins :[{
//        ptype : 'cmprowexpander',
//        createComponent: function(view, record, htmlnode, index) {
//            return Ext.create("Lumen.view.FamilyInfo");
//    }
//    }],
    minHeight: 377,
    width: "100%",
    frame: true,
    title: 'People',
    store: "Student",
    disableSelection: true,
    loadMask: true,
    autoDestroy: true,
    pageSize: 10,
    rootVisible: false,
    loadOptions: {
        criteria: JSON.stringify([{
            name: "firstName",
            operation: "not null",
            conjunction: "and"
        }, {
            name: "status",
            value: "enrolled",
            conjunction: "and"
        }]),
        loadDebitSchedules: true
    },
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
        ]
        this.listeners = {
            afterrender: {
                fn: function (grid) {
                    grid.getStore().getProxy().extraParams = grid.loadOptions;
                    grid.getStore().load();
                }
            }
        }
        this.callParent(arguments);
        this.getStore().getProxy().extraParams = self.loadOptions
    },
    viewConfig: {
        trackOver: false,
        stripeRows: true
    },
    //    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
    //        clicksToEdit: 1
    //    })],
    refresh: function (options) {
        this.getStore().removeAll();
        this.getStore().getProxy().extraParams = self.loadOptions
        this.getStore().load();
    },
    initComponent: function () {
        Ext.apply(this, {
            // grid columns
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 32,
                    icon: Lumen.IMAGES_URL_ROOT + '/icons/view.png',
                    tooltip: 'View Application',
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM, {applicationId: record.getId()})
                    }
                },
            /**
             {
                 xtype: 'treecolumn', //this is so we know which column will show the tree
                 text: Lumen.i18n('Guardian'),
                 flex: 2,
                 sortable: true,
                 dataIndex: 'guardianList'
             },
             **/
                {
                    text: "First name",
                    dataIndex: 'firstName',
                    flex: 5,
                    sortable: true
                },
                {
                    text: "Last name",
                    dataIndex: 'lastName',
                    flex: 5,
                    sortable: true
                },
                {
                    text: "Grade",
                    dataIndex: 'schoolAttributes.level',
                    flex: 1,
                    sortable: false
                },
                {
                    text: "Schedule Total",
                    dataIndex: 'debitScheduleSummary.scheduleTotal',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                },
                {
                    text: "Last Payment",
                    dataIndex: 'debitScheduleSummary.lastPaymentDate',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return value ? Ext.Date.format(new Date(value), 'm-d-Y') : "";
                    }
                },
                {
                    text: "Last Amount",
                    dataIndex: 'debitScheduleSummary.lastPaymentAmount',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                },
                {
                    text: "Pending Debit Amount",
                    dataIndex: 'debitScheduleSummary.nextDebitAmount',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return Ext.util.Format.currency(value);
                    }
                },
                {
                    text: "Pending Debit",
                    dataIndex: 'debitScheduleSummary.nextScheduledDebit',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return value ? Ext.Date.format(new Date(value), 'm-d-Y') : "";
                    }
                },
                {
                    text: "Future Due Date",
                    dataIndex: 'debitScheduleSummary.nextDueDate',
                    flex: 5,
                    sortable: false,
                    renderer: function (value) {
                        return value ? Ext.Date.format(new Date(value), 'm-d-Y') : "";
                    }
                },
                {
                    xtype: 'actioncolumn',
                    width: 32,
                    icon: Lumen.IMAGES_URL_ROOT + '/icons/clipboard.png',
                    tooltip: 'View Enrollment',
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        Lumen.getApplication().fireEvent(Lumen.SHOW_ENROLLMENT_DOCUMENTS, {
                            applicant: record.raw
                        })
                    }
                }
            ]
        });
        this.callParent(arguments);
    }
});