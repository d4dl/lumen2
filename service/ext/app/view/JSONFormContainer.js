// @define LumenClient.view.ClientApplication
Ext.define('Lumen.view.JSONFormContainer',{
    extend: "Ext.tab.Panel",
    alias: "widget.jsonformcontainer",
    frame: true,
    autoHeight: true,
    cls: "applicationPanel",
    autoDestroy: true,

    constructor: function (config) {
        Lumen.USE_APPLICATION_STORE = false;
        this.callParent([config]);
    },
    initComponent: function() {
        this.callParent(arguments);
        var tabs = this.query('tab');
        if(tabs.length == this.items.items.length) {
            for(var i=0; i < tabs.length; i++) {
                var tab = tabs[i];
                var item = this.items.items[i];
                var itemCls = item['cls'];
                if(itemCls) {
                    tab.addCls(item.itemId + "-tab");
                }
            }
        }
        this.addListener({
            afterrender: {
                fn: function () {
                    Lumen.getApplication().fireEvent(Lumen.LOAD_DOCUMENT_LIST,{formRoot: this});

                    if(true) {
                        var baseApplication = this.ownerCt;
                        var self = this;
                        var printableBases = this.ownerCt.el.select(".printableBase").each(function(printableBase) {
                            var buttonHtml = "<img class='printButton' width='32'  height='32' src="+ Lumen.IMAGES_URL_ROOT + "/icons/printer.png>";
                            var buttonElement = printableBase.createChild({html: buttonHtml});

                            buttonElement.addListener({click: function() {
                                //Lumen.getApplication().fireEvent(Lumen.EXPAND_EVERYTHING);
                                var applicationData = Ext.data.StoreManager.lookup('Lumen.store.JSONForm').getOrCreateFormData();


                                var applicationTabs = [new Lumen.controller.util.HtmlExtractor().extractApplicationHtml(self, applicationData)];
                                var loadMask = new Ext.LoadMask(Ext.getCmp("lumenMainApplication"), {msg:"Please wait..."});
                                loadMask.show();

                                var body = Ext.getBody();
                                var url =  Lumen.DATA_SERVICE_URL_ROOT + "/printService.php";
                                var form = body.createChild({
                                    tag:'form',
                                    method: "post",
                                    action: url,
                                    target:'_blank'
                                });
                                for(var i=0; i < applicationTabs.length; i++) {
                                    form.createChild({
                                        tag:'input',
                                        type: 'hidden',
                                        name: "applicationSection[]",
                                        value: Ext.String.htmlEncode("<div>"+applicationTabs[i]+"</div>")
                                    });
                                }
                                form.dom.submit();


                                //This forces the download of an iframe for application/pdf content types.

                                //                                var frame = body.createChild({
                                //                                    tag:'iframe',
                                //                                    cls:'x-hidden',
                                //                                    id:'hiddenform-iframe',
                                //                                    name:'iframe'
                                //                                });
                                //
                                //                                var form = body.createChild({
                                //                                    tag:'form',
                                //                                    method: "post",
                                //                                    cls:'x-hidden',
                                //                                    id:'hiddenform-form',
                                //                                    action: url,
                                //                                    target:'iframe'
                                //                                });
                                //
                                //                                form.createChild({
                                //                                    tag:'input',
                                //                                    type: 'hidden',
                                //                                    name: "filename",
                                //                                        value: Ext.String.htmlEncode(applicationData.Child.firstName + "_" + applicationData.Child.lastName + ".pdf")
                                //                                });
                                loadMask.hide();
                                //
                                //                                Ext.Ajax.request({
                                //                                    url: Lumen.DATA_SERVICE_URL_ROOT + "printService.php",
                                //                                    params: {
                                //                                        applicationData: Ext.JSON.encode(htmlMessage),
                                //                                        filename: applicationData.Child.FirstName + "_" + applicationData.Child.LastName + ".pdf"
                                //                                    },
                                //                                    method: "POST",
                                //                                    context: this,
                                //                                    failure: function (response) {
                                //                                        loadMask.hide();
                                //                                    },
                                //                                    success: function (response,opts) {
                                //                                        loadMask.hide();
                                //                                    }
                                //                                });
                            }})
                        }, this);
                    } else {
                        //this.relevantTabToFront();
                    }
                }
            }
        });

    }
});