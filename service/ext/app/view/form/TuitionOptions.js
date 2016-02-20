Ext.define('Lumen.view.form.TuitionOptions', {
    extend: 'Lumen.view.form.DataFormFieldSet',
    alias: 'widget.tuitionoptions',
    constructor: function(config) {
        this.dataItemKey = "TuitionOption",
        this.callParent(arguments);
        this.addListener({
            afterrender:{
                fn: function(){
                    Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {formRoot: this.ownerCt});
                },
                scope: this
            }});

    },
    onChange: function(target, newValue, oldValue, eOpts) {
        var tuitionOption = null;
        for(var i=0; i < this.applicationData.TuitionOptionArray.length; i++) {
            var option = this.applicationData.TuitionOptionArray[i];
            if(option.TuitionOptionTypeId == target.inputValue) {
                tuitionOption = option;
                break;
            }
        }
        if(!tuitionOption) {
            tuitionOption = {
                OrderIndex: target.OrderIndex,
                OptionSpecifier: target.OptionSpecifier,
                TuitionOptionTypeId: target.inputValue
            }
            this.applicationData.TuitionOptionArray.push(tuitionOption);
        }


        if(target.getValue()) {//IE it is selected
            tuitionOption.TuitionOptionTypeId = target.inputValue;
        } else {
            //remove the tution option
            for(var j=this.applicationData.TuitionOptionArray.length - 1; j >= 0; j--) {
                var candidateTutionOption = this.applicationData.TuitionOptionArray[j]
                if(candidateTutionOption.TuitionOptionTypeId == target.inputValue) {
                    this.applicationData.TuitionOptionArray.splice(j, 1);
                }
            }
        }
    },

    getOutputLabel: function() {
        // throw new Error("This must be overridden.");
        return "<div class='outputLabel'>Lumen.i18n('Program Options', Lumen.PROMPT)</div>";
    },
    getOutputHtml: function() {
        var output = "";
        var checkboxes = this.query('checkbox');
        for(var i=0; i < checkboxes.length; i++) {
            var checkbox = checkboxes[i];
            if(checkbox.getValue()) {
                output += checkbox.boxLabel + "<br/>";
            }
        }

        return output ? output : "";
    },

    setDataItem: function(applicationData, renderForPrint, readOnly, hideData) {
        this.applicationData = applicationData;
        var TuitionOptionArray = this.applicationData.TuitionOptionArray;
        if(!TuitionOptionArray) {
            TuitionOptionArray = [];
            this.applicationData.TuitionOptionArray = TuitionOptionArray;
        }
        for(var i=0; i < TuitionOptionArray.length; i++) {
//            if(!TuitionOptionArray[i]) {
//                TuitionOptionArray[i] = defaultOptions[i];
//            }
            if(TuitionOptionArray[i].TuitionOptionTypeId) {
                this.query("[inputValue='"+TuitionOptionArray[i].TuitionOptionTypeId+"']")[0].setValue(true);
            }
        }
    },
    layout: 'anchor',
    defaults: {
        anchor: '100%',
        labelWidth: 50
    },

    createFormItems: function(config) {
        var items =
            [
                {
                    xtype: "component",
                    html: "<div class='instructions'>Choose additional program options you're applying for.</div>"
                },
                {
                    xtype: "radiogroup",
                    layout: {
                        type: "table",
                        columns: 2,
                        tdAttrs: {
                            cls: "sectionTableCell"
                        },
                        trAttrs: {
                            cls: "sectionTableRow"
                        },
                        tableAttrs: {
                            cls: "sectionTable"
                        }
                    },
                    defaults: {
                        flex: 1,
                        autoHeight: true
                    },
                    items: [
                        {//TD
                            layout: 'vbox',
                            xtype: 'container',
                            defaults: {
                                autoHeight: true,
                                fieldBodyCls: "compactRadioWrap",
                                fieldCls: 'compactRadio',
                                labelCls: 'compactLabel',
                                boxLabelCls: 'optionsLabel',
                                labelAlign: "left",
                                padding: "2, 10"
                            },
                            items: [
                                {
                                    xtype: 'checkbox',
                                    name: "tuitionAfterSchool",
                                    OptionSpecifier: "additional",
                                    boxLabel: 'After School 3:00-6:00 p.m.',
                                    OrderIndex: 1,
                                    inputValue: 1,
                                    listeners:{change: this.onChange, scope: this}
                                },
                                {
                                    xtype: 'checkbox',
                                    name: "tuitionEarlyArrival",
                                    OptionSpecifier: "additional",
                                    OrderIndex: 2,
                                    inputValue: 2,
                                    boxLabel: 'Early Arrival 7:00-9:00 a.m.',
                                    listeners:{change: this.onChange, scope: this}
                                }
                            ]
                        }
                    ]
                }
            ];
        return items;
    }
});