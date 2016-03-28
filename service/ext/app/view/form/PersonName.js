Ext.define('Lumen.view.form.PersonName', {
    extend: 'Lumen.view.form.DataFormFieldSet',
    cls: 'personNameFieldSet',
    alias: 'widget.personname',
    personData: null,
    border: false,
    preventDanglingData: true,

    getOutputHtml: function() {
         var output = "<div>"+(this.personData.Title ? this.personData.Title : "") + " " +
                      (this.personData.firstName ? this.personData.firstName : "") + " " +
                      (this.personData.lastName ? this.personData.lastName : "") + " " +
                      (this.personData.suffix ? this.personData.suffix : "")+"</div>";
        return output;
    },
    setRenderObject: function(personData) {
        this.personData = personData;
    },
    isValid: function() {
        var hasFirst = this.query("[fieldLabel='First']")[0].isValid();
        var hasLast = this.query("[fieldLabel='Last']")[0].isValid();
        return hasFirst && hasLast;
    },

    createFormItems: function(config) {
        var items = [
                {
                    xtype: 'container',
                    title: config.title,
                    combineErrors: true,
                    //collapsed: true,
                    msgTarget: 'under',
                    layout: "hbox",
                    border: false,
                    defaults: {
                        hideLabel: false,
                        labelAlign: "top",
                        fieldBodyCls: "widgetInputFieldWrapper",
                        fieldCls: "widgetInputField"
                    },
                    items: [
                        //{xtype: 'textfield', listeners:{change: this.onChange, scope: this}, fieldLabel: 'Title', width: 30, allowBlank: true},
                        {xtype: 'textfield', name: "firstName", fieldLabel: 'first', fieldCls: 'leftInput', width: 160, allowBlank: false},
                        {xtype: 'textfield', name: "lastName", fieldLabel: 'last', width: 180, fieldCls: 'middleInput', allowBlank: false},
                        {xtype: 'textfield', name: "suffix", fieldLabel: 'suffix', width: 94, fieldCls: 'rightInput', allowBlank: true}
                    ]
                }
            ]


        //Remove the title if it is not to be shown.
//        if(config.showTitle === false) {
//            items[0].items[0].style = {display: "none"};
//        }
        return items;
    }

});