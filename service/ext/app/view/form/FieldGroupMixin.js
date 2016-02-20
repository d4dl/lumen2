Ext.define('Lumen.view.form.FieldGroupMixin', {
    extend: Ext.Base,
    onAdded: function() {
        if(!this.name) {
            throw new Error("FiedGroups must have a name.");
        }
        var ownerPrefix = this.ownerCt.name ? this.ownerCt.name + "." : "";
        var wholeName = ownerPrefix + this.name;
        for(var i=0; i < this.items.items.length; i++) {
            this.items.items[i].name = wholeName;
        }
        var self = this;
    },
    getValue: function() {
        var values = [],
            boxes  = this.getBoxes(),
            b,
            bLen   = boxes.length,
            box, name, inputValue, bucket;

        for (b = 0; b < bLen; b++) {
            box        = boxes[b];
            name       = box.getName();
            inputValue = box.inputValue;

            if (box.getValue()) {
                values.push(box.inputValue);
            }
        }

        return values;
    },
    setValue: function(value) {
        if(!Ext.isArray(value)) {
            value = [value];
        }
        var me    = this;
        var boxes = me.getBoxes();
        var boxCount  = boxes.length;

        me.batchChanges(function() {
            for (var b = 0; b < boxCount; b++) {
                var box = boxes[b];
                var name = box.getName();
                var checkboxValue = Ext.Array.contains(value, box.inputValue);

                box.setValue(checkboxValue);
            }
        });
        return me;
    }
});