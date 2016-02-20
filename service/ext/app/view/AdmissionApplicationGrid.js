var pluginExpanded = true;
var grid = Ext.define('Lumen.view.AdmissionApplicationGrid', {
    extend:"Ext.grid.Panel",
    minHeight:377,
    width: "100%",
    frame: true,
    title:'Admission Applications',
    store:"Lumen.store.AdmissionApplicationList",
    disableSelection:true,
    loadMask:true,
    autoDestroy: true,
    pageSize: 10,

    viewConfig:{
        trackOver:false,
        stripeRows:true
    },
    listeners: {
        afterrender: {
            fn: function(grid) {
                grid.getStore().load({
                    params: {
                        applicationType: this.applicationType
                    }});
            }
        }
    },
    refresh: function(options) {
        this.getStore().removeAll();
        this.getStore().load({
            params: {
                applicationType: options.applicationType
        }});
    },
    // grid columns
    constructor: function() {
        this.columns = [
            {
                xtype:'actioncolumn',
                width:32,
                icon: Lumen.IMAGES_URL_ROOT + '/icons/view.png',
                tooltip: 'View Application',
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    Lumen.getApplication().fireEvent(Lumen.SHOW_APPLICATION_FORM, {applicationId: record.getId()})
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
                text:"First name",
                dataIndex:'Child.Person.FirstName',
                flex: 1,
                sortable:false,
                renderer: function(value, metadata, application, rowIndex, colIndex, store, view) {
                    return application.raw.Child.Person.FirstName;
                }
            },
            {
                text:"Last name",
                dataIndex:'Child.Person.LastName',
                width:200,
                sortable:false,
                renderer: function(value, metadata, application, rowIndex, colIndex, store, view) {
                    return application.raw.Child.Person.LastName;
                }
            },
            {
                text:"Age",
                dataIndex:'age',
                width:100,
                sortable:false
            },
            {
                text: Lumen.i18n("Grade"),
                dataIndex:'Grade',
                renderer : function(value, cell, model, index) {
                    if(value) {
                        if(model.raw.Child.Person.Grade) {
                            model.raw.Child.Person.Grade;
                        } else {
                            return model.raw.Grade;
                        }
                    } else {
                        return "";
                    }
                },
                width:80,
                sortable:true
            },
            {
                text:"Amount Paid",
                dataIndex:'AmountPaid',
                flex: 1,
                sortable:true
            },
            {
                text:"Date Submitted",
                dataIndex:'DateSubmitted',
                xtype: 'datecolumn',
                format:'M-d-Y H:i',
                renderer : function(value, cell, model, index) {
                    if(value) {
                        var data = new Date();
                        if(value < 10000000000) {
                            value = value * 1000;
                        }
                        data.setTime(value);
                        return Ext.util.Format.date(data, 'M-d-Y H:i');
                    } else {
                        return "";
                    }
                },
                width:140,
                sortable:true
            }
            ,
            {
                text:"Status",
                dataIndex:'Status',
                width:100,
                sortable:true
            },
            {
                xtype:'actioncolumn',
                width:32,
                icon: Lumen.IMAGES_URL_ROOT + '/icons/clipboard.png',
                tooltip: 'View Enrollment',
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    Lumen.getApplication().fireEvent(Lumen.SHOW_ENROLLMENT_DOCUMENTS, {applicationId: record.getId(), applicantId: record.get("ChildId")})
                }
            }
        ];
        this.callParent(arguments);
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store:"Lumen.store.AdmissionApplicationList",
        dock: 'bottom',
        pageSize: 10, // items per page
        displayInfo: true
    }]
});