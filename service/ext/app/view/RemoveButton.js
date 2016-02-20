Ext.define('Lumen.view.RemoveButton',{
    extend: "Ext.button.Button",
    alias: "widget.removebutton",
    initComponent: function() {
        this.callParent(arguments);
        this.addListener("click", function() {
            alert("Clicked");
        });
    }
});