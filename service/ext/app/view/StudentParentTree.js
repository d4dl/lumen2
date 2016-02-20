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
    store: "Person",
    disableSelection: true,
    loadMask: true,
    autoDestroy: true,
    pageSize: 10,
    rootVisible: false,
    constructor: function() {
        var self = this;
        var store = Ext.data.StoreManager.lookup('Person');
        Ext.apply(store.proxy.extraParams, {criteria: JSON.stringify({"School.Role": "Student"}), loadParents: true});
        store.on("datachanged", function(){
        });
        this.dockedItems = [
//            {
//                xtype: 'pagingtoolbar',
//                store: "Person",
//                dock: 'bottom',
//                pageSize: 10, // items per page
//                displayInfo: true
//            },
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
                    grid.getStore().load(self.loadOptions);
                }
            }
        }
        this.callParent(arguments);
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
        this.getStore().load(self.loadOptions);
    },
    initComponent: function () {
        Ext.apply(this, {
            // grid columns
            columns: [
//                {
//                    xtype: 'treecolumn', //this is so we know which column will show the tree
//                    text: Lumen.i18n('First Name'),
//                    flex: 2,
//                    sortable: true,
//                    dataIndex: 'Person.FirstName'
//                },
                {
                    text: "First name",
                    dataIndex: 'Person.FirstName',
                    flex: 5,
                    sortable: true
                },
                {
                    text: "Last name",
                    dataIndex: 'Person.LastName',
                    flex: 5,
                    sortable: true
                },
                {
                    text: "Role",
                    dataIndex: 'School.Role',
                    flex: 5,
                    sortable: true
                },
//                {
//                    text: "Age",
//                    dataIndex: 'age',
//                    flex: 1,
//                    sortable: false
//                },
                {
                    text: "Grade",
                    dataIndex: 'School.Grade',
                    flex: 1,
                    sortable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});