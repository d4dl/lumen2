Ext.define('Lumen.view.form.ProductCheckBoxGroup', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.productcheckboxgroup',
    //This displays three options and a possible opt out option.
    //If the opt out option is checked, the other options are cleared.
    //The amount is calculated based on the number of checkboxes checked.
    initComponent: function() {
        this.callParent(arguments);
        var self = this;
        var checkboxes = this.query('checkbox');
        for(var j=0; j < checkboxes.length; j++) {
            var currentCheckbox = checkboxes[j];
            currentCheckbox.addListener('change', function(changedField, newValue, oldValue, eOpts) {
                self.suspendCheckChange = true;
                var clearOthers = self.query("[clearOthers='true']");
                var checkedBoxes = self.query("[checked='true']");
                if(changedField.name == 'optOut' && changedField.getValue() == true) {
                    self.setValue({optOut: 'on'});
                    self.productAmount = 0;
                } else {
                    var selfValue = self.getValue();
                    delete selfValue['optOut'];
                    self.setValue(selfValue);
                    self.productAmount = self.productAmounts[checkedBoxes.length];
                }

                self.suspendCheckChange = false;
            });
        }
    },

    getAmount: function() {
        return this.productAmount;
    }
});