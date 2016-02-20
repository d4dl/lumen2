Ext.define('Lumen.view.form.Address',{
    extend: 'Lumen.view.form.DataFormFieldSet',
    alias: 'widget.address',
    collapsible: false,
    collapsed: false,
    dataItemKey: "OrderIndex",//The label is the key used to find the data item.
    layout: 'hbox',

//    setDataItem: function(address, renderForPrint, readOnly, hideData) {
//        this.address =  address;
//
//        this.query("[fieldLabel='Street']")[0].setValue(address.Street);
//        this.query("[fieldLabel='Street 2']")[0].setValue(address.Street2);
//        this.query("[fieldLabel='City']")[0].setValue(address.City);
//        this.query("[fieldLabel='State']")[0].setValue(address.Province);
//        this.query("[fieldLabel='Postal code']")[0].setValue(address.PostalCode);
//        this.query("[fieldLabel='Country']")[0].setValue(address.Country);
//    },

    setRenderObject: function(address) {
        this.address = address;
    },
    getOutputLabel: function() {
        // throw new Error("This must be overridden.");
        return "<div class='outputLabel'>Address</div>";
    },
    getOutputHtml: function() {
        var address = this.address;
        if(!address) {
            return "";
        }
        var output =(address.Street ?  address.Street : "") + "<br/>"+
                    (address.Street2 ? (address.Street2 + "<br/>") : "")  +
                    (address.City ? (address.City + ", ") : "") +
                    (address.Province ? address.Province : "") + " " +
                    (address.PostalCode ? address.PostalCode : "") + "<br/>" +
                    (address.Country ? address.Country : "")
        return output;
    },
    createFormItems: function (config) {
        var items = [
            {
                xtype: 'container',
                title: config.title,
                //collapsed: true,
                combineErrors: true,
                msgTarget: 'under',
                collapsible: true,
                layout: {
                    type: "table",
                    columns: 4
                },
                defaults: {
                    labelAlign: "top",
                    fieldBodyCls: "widgetInputFieldWrapper",
                    fieldCls: "widgetInputField"
                },
                items: [
                    {xtype: 'textfield',colspan: 4,name: 'Street',fieldLabel: 'Street',width: 440,allowBlank: false},
                    {xtype: 'textfield',colspan: 4,name: 'Street2',fieldLabel: 'Street 2',width: 440,allowBlank: true},
                    {xtype: 'textfield',name: 'City', fieldLabel: 'City', cls:'leftInput', width: 170,allowBlank: false},
                    {
                        xtype: 'combobox',
                        cls: 'middleInput',
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        store: Ext.create("Lumen.store.StateStore"),
                        emptyText: 'State',
                        margins: '0 6 0 0',
                        allowBlank: false,
                        forceSelection: true,
                        name: 'State',
                        fieldLabel: 'State',
                        width: 120,
                        allowBlank: false
                    },
                    {xtype: 'textfield',cls: 'middleInput',name: 'PostalCode',fieldLabel: 'Postal code',width: 100,allowBlank: false},
                    {
                        xtype: 'combobox',
                        displayField: 'name',
                        valueField: 'name',
                        queryMode: 'local',
                        store: Ext.create("Lumen.store.CountryStore"),
                        emptyText: 'Country',
                        margins: '0 6 0 0',
                        allowBlank: false,
                        forceSelection: true,
                        fieldLabel: 'Country',
                        name: 'Country',
                        cls: 'rightInput',
                        width: 220,
                        allowBlank: false
                    }
                ]
            }
        ]
        return items;
    }
});