Ext.define('Lumen.view.form.FormLoader', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.appformloader',
    cls: 'formloader',
    constructor: function(config) {
        var self = this;
        var start = new Date().getTime();
        this.loader = {
            url: config.url,
            hideMode: 'offset',
            animCollapse: true,
            autoLoad: true,
            renderer: "component",
            loadMask: true,
            listeners: {
                load: function() {
                    //Lumen.log("1) Finished loading " + this.url, start);
                    Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {formRoot: this.target, modelToLoad: self.modelToLoad, JSONPathPrefix: self.getJSONPathPrefix()});
                    //Lumen.log("2) Finished Populating " + this.url, start);
                }
            }
        }
        if(config.createDockedItems) {
            this.dockedItems = config.createDockedItems();
        }
        this.callParent(arguments);

        var target = this.target;
        var listeners = Lumen.getApplication().addListener({
            destroyable: true,
            "ADMISSION_APPLICATION_SAVED":{
                fn: function(){
                    //Lumen.log("app saved. populating " + this.url);
                    Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {formRoot: this, modelToLoad: self.modelToLoad, JSONPathPrefix: self.getJSONPathPrefix()});
                },
                scope: this
            },
            "DESTROY_ALL_FORMS":{
                fn: function() {
                    //Sometimes destroy gets fired before this thing
                    //even gets a chance to render.  ie when its the one replacing everything else.
                    if(this.rendered) {
                        //Lumen.log("destroying form " + this.id + " " + this.url);
                        Ext.destroy(listeners);
                        this.close();
                        // this.ownerCt.remove(this, true);
                    }
                },
                scope: this
            }
        });
        var form = this.down('form');
        if(form) {
            this.baseForm = form.getForm();
        }
    },
    initComponent: function() {
        this.callParent(arguments);

//        var self = this;
//        this.addListener(
//            {
//                afterrender: function() {
//                    //Lumen.log("Rendering ");
//                    //Lumen.getApplication().fireEvent(Lumen.POPULATE_FORM, {formRoot: self, modelToLoad: self.modelToLoad, JSONPathPrefix: self.getJSONPathPrefix()});
//                },
//                add: function(panel, componentAdded) {
//                    Lumen.log("Component added to loader " + this.title);
//                },
//                added: function(panel, container) {
//                    Lumen.log("Loader added to container " + this.title);
//                }
//            }
//        );
    },
//    extractHtml: function() {
//        return new Lumen.controller.util.HtmlExtractor().extractApplicationHtml(this);
//    },
    add: function(self, component, index, eOpts ) {

        this.layout.rendered = false;
        this.callParent(arguments);
    },
    getJSONPathPrefix: function() {
        var prefix = "";
        var ownerContainer = this;
        while(ownerContainer != null) {
            if(ownerContainer.name) {
                prefix = ownerContainer.name + (prefix ? ("." + prefix) : "");
            }
            ownerContainer = ownerContainer.ownerCt;
        }
        return prefix;
    },
    expand: function(animate) {
        this.callParent(arguments);
    },
    collapse: function(animate) {
        this.callParent(arguments);
    },
    listeners: {

    }
});