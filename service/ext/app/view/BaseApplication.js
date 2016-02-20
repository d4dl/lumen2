if (typeof LumenClient == "undefined") {
    Lumen.loadExternalCode();
}
// @define LumenClient.view.ClientApplication
Ext.define('Lumen.view.BaseApplication', {
    extend: "LumenClient.view.ClientApplication",
    alias: "widget.baseapplication",
    frame: true,
    autoHeight: true,
    cls: "applicationPanel",
    autoDestroy: true,
    mixins: {
        jsonForm: Lumen.view.JSONForm
    },

    constructor: function (config) {
        //WITH INTRO
        //        var introItem = this.items[0];
        //        var applicationItem = this.items[1];
        //        var documentsItem = this.items[2];
        //        introItem.loader.url = config.introUrl;
        //WITHOUT INTRO
        Lumen.USE_APPLICATION_STORE = true;
        this.addApplicationItems(config);
        this.callParent([config]);
        this.mixins.jsonForm.constructor.call(this, config);
    }
});