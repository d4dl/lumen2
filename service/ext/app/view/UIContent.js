
var uiContent = Ext.define('Lumen.view.UIContent',{
    alias: 'widget.uicontent',
    extend: "Ext.container.Container",
    cls: "admission-application",
    autoDestroy: true,
    //autoHeight:true,
    layoutOnTabChange:true,
    hideMode: "offset",
    layout: "fit",
    constructor: function(config) {
        this.loader = {
            url: Lumen.DATA_SERVICE_URL_ROOT + '/uiService.php',
            autoLoad: true,
            scripts: true,
            loadMask: true
        }
        this.loader.params = config.params;
        if(config.params.json && (config.params.json == "true" || config.params.json == true)) {
            this.loader.renderer = "component";
        } else {
            this.loader.renderer = "html";
        }
        this.callParent([config]);
    },
    listeners: {
        afterrender: function() {
            Lumen.getApplication().fireEvent(Lumen.AJAXIFY, {root: this.getEl().dom});
            if(this.loader.params.afterrender) {
                this.loader.params.afterrender();
            }
        }
    }
})
