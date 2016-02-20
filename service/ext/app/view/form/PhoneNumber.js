Ext.define('Lumen.view.form.PhoneNumber', {
    extend: 'Lumen.view.form.DataFormFieldSet',
    alias: 'widget.phonenumber',
    cls: 'phoneSection',

//    getOutputLabel: function() {
//        // throw new Error("This must be overridden.");
//        return "<div class='outputLabel'>Phone</div>";
//    },
    getOutputHtml: function() {
        var output = "";
        var phoneArray = this.PhoneArray;

        for(var i=0; i < phoneArray.length; i++) {
            if(output) {
                output += "<br/>"
            }
            if(phoneArray[i] ) {
                var phone = phoneArray[i];
                output += this.items.items[i].fieldLabel + ": " + phone;
            }

        }
        return output;
    },
    setRenderObject: function(personData) {
        this.PhoneArray = personData;
    },

//    setDataItem: function(personData, renderForPrint, readOnly, hideData) {
//        this.personData = personData;
//        var phoneArray = this.personData.PhoneArray;
//        if(!phoneArray) {
//            phoneArray = [{OrderIndex: 0},{OrderIndex: 1},{OrderIndex: 2},{OrderIndex: 3}];//4 numbers
//            this.personData.PhoneArray = phoneArray
//        }
//        for(var i=0; i < phoneArray.length; i++) {
//            if(phoneArray[i].Number) {
//                this.query("[OrderIndex='"+i+"']")[0].setValue(phoneArray[i].Number);
//            }
//        }
//    },
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        labelWidth: 50
    },

    createFormItems: function(config) {
        var items =
            [
                {
                    xtype: 'fieldcontainer',
                    label : config.label,
                    fieldLabel: 'Home',
                    PhoneType: "home",
                    combineErrors: true,
                    msgTarget: 'under',
                    layout: "hbox",
                    allowBlank: false,
                    defaults: {
                        hideLabel: true,
                        fieldBodyCls: "phoneInputWrapper"
                        //fieldCls: "phone"
                    },
                    items: [
                        {xtype: 'textfield',name: "0", OrderIndex: 0, fieldLabel: 'Phone 1', width: 152, allowBlank: true}
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Office',
                    PhoneType: "office",
                    layout: "hbox",
                    combineErrors: true,
                    msgTarget: 'under',
                    defaults: {
                        hideLabel: true
                    },
                    items: [
                        {xtype: 'textfield', name: "1", OrderIndex: 1, fieldLabel: 'Phone 2',  width: 152, allowBlank: true}
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Cell',
                    PhoneType: "cell",
                    layout: "hbox",
                    combineErrors: true,
                    msgTarget: 'under',
                    defaults: {
                        hideLabel: true
                    },
                    items: [
                        {xtype: 'textfield',name: "2", OrderIndex: 2, fieldLabel: 'Phone 3', width: 152, allowBlank: true}
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Other',
                    PhoneType: "other",
                    layout: "hbox",
                    combineErrors: true,
                    msgTarget: 'under',
                    margin: "0px 0px 8px 0px",
                    defaults: {
                        hideLabel: true
                    },
                    items: [
                        {xtype: 'textfield',name: "3", OrderIndex: 3, fieldLabel: 'Phone 4', width: 152, allowBlank: true}
                    ]
                }
            ];
        return items;
    }
});