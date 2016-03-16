var pluginExpanded = true;
var grid = Ext.define('Lumen.view.PersonGrid', {
    extend: "Ext.grid.Panel",
    minHeight: 377,
    width: "100%",
    frame: true,
    title: 'People',
    store: "Person",
    disableSelection: true,
    loadMask: true,
    autoDestroy: true,
    pageSize: 10,
    constructor: function() {

        var store = Ext.data.StoreManager.lookup('Person');
        this.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: "Person",
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
        this.callParent(arguments);
    },
    viewConfig: {
        trackOver: false,
        stripeRows: true
    },
    listeners: {
        afterrender: {
            fn: function (grid) {
                grid.getStore().load({
                    params: {
                        personType: "Student"
                    }});
            }
        }
    },
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    })],
    refresh: function (options) {
        this.getStore().removeAll();
        this.getStore().load({
            params: {personType: "Student"}});
    },
    // grid columns
    columns: [
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
            text: "Age",
            dataIndex: 'age',
            flex: 1,
            sortable: false
        },
        {
            text: "Grade",
            dataIndex: 'schoolAttributes.level',
            flex: 1,
            sortable: true
        }
    ]
});