Ext.define('Lumen.view.BaseForm',{
    extend: "Ext.panel.Panel",
    alias: "widget.baseform",
    frame: true,
    autoHeight: true,
    autoDestroy: true,
    mixins: {
        jsonForm: Lumen.view.JSONForm
    },

    constructor: function (config) {
        this.addApplicationItems(config);
        this.callParent([config]);
        this.mixins.jsonForm.constructor.call(this, config);
    },
    initializeItems: function (config) {
        var items = [{
            //autoHeight: true,
            //height: 500,
            itemId: "application",
            fill: true,
            width: '100%',
            activeItem: 0,
            xtype: "form",
            border: false,
            bodyBorder: false,
            url:Lumen.DATA_SERVICE_URL_ROOT + '/updateApplication.php',
            layout: "vbox",
            //buttons: this.createButtons(),
            defaults: {
                xtype: 'appformloader',
                labelAlign: 'right',
                hideMode: 'display'
            }
        }]
        return items;
    }
});