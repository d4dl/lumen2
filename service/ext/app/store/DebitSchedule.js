Ext.define('Lumen.store.DebitSchedule', {
    extend: 'Lumen.store.RestStore',
    model: 'Lumen.model.DebitSchedule',
    constructor: function (config) {
        this.proxy = this.createProxy()
        //        this.proxy = {
        //            type: 'ajax',
        //            url: Lumen.DATA_SERVICE_URL_ROOT + '/applicationFinder.php',
        //            reader: {
        //                root: 'applications',
        //                type: 'json',
        //                idProperty: '_id.$id'
        //            }
        //        }
        this.callParent(arguments);
    },
    createProxy: function () {
        var proxy = this.callParent(arguments);
        Ext.apply(proxy, {
            url: Lumen.DATA_SERVICE_URL_ROOT + "/documentService.php",
            //url: Lumen.REST_DATA_SERVICE_URL_ROOT + '/finance/debitSchedules/khabelestrong',
//            reader: {
//                root: 'content',
//                type: 'json',
//                totalProperty: 'totalElements',
//                idProperty: "name"
//            },
            extraParams: {
                documentType: "DebitSchedule"
            }
        });
        return proxy;
    }
});