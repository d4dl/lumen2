Lumen = typeof(Lumen) == "undefined" ? {} : Lumen
Lumen.loadExternalCode = function() {
    Ext.namespace('LumenClient', 'LumenClient.view');
    var clientApplication = Ext.define('LumenClient.view.ClientApplication', {
        //This file has the implementation of initializeItems used by BaseApplication.
        //It should be copied to each client installation as ClientApplication.js and modified. as needed
        //Avoid adding functionality.  This class should ultimately dissappear.
        extend: "Ext.tab.Panel",
        alias: "widget.clientapplication",


        initializeItems: function (config) {
            var self = this;
            var items = [
                {
                    title: "Application",
                    //autoHeight: true,
                    //height: 500,
                    itemId: "application",
                    fill: true,
                    activeItem: 0,
                    xtype: "form",
                    border: false,
                    bodyBorder: false,
                    url:Lumen.DATA_SERVICE_URL_ROOT + '/updateApplication.php',
                    layout: this.getRenderedLayoutName(),
                    //animate: true,
                    //height: 570,
                    buttons: this.createButtons(),
                    defaults: {
                        xtype: 'appformloader',
                        labelAlign: 'right',
                        hideMode: 'display'
                    },
                    items: [
                        //don't add anything here.
                    ]
                },
                {
                    title: "Documents",
                    skipTraverse: true,
                    url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/DocumentsHSMS.js"
                },
                {
                    xtype: 'appformloader',
                    title: "Application Fee",
                    skipTraverse: true,
                    itemId: 'applicationFeePanel',
                    completeSection: "necessary_for_completeness_verification",
                    url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/PaymentForm.js"
                }
                //        {
                //            title: "Admissions Meeting",
                //            height: 500,
                //            loader: {
                //                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/AdmissionsMeeting.js",
                //                autoLoad: true,
                //                renderer: "component"
                //            }
                //        },
                //        {
                //            title: "Letter of Intent",
                //            height: 500,
                //            loader: {
                //                url: Lumen.FORM_DEFINITION_URL_PREFIX + "/components/LetterOfIntent.js",
                //                autoLoad: true,
                //                renderer: "component"
                //            }
                //        }
            ];
            if(config.showGuestDaysPanel) {
                this.addGuestDaysPanel(items);
            }

            return items;
        }
    });
    //For some reason the compiled version doesn't create ClientApplication in time.  Here its forced.
    //But undone in the debug environment because that would break with the force.
//    LumenClient = {
//        view: {
//            "ClientApplication": clientApplication
//        }
//    }
};
