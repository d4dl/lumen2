Ext.define('Lumen.store.DebitScheduleTemplate', {
    extend: 'Lumen.store.RestStore',
    model: 'Lumen.model.DebitScheduleTemplate',
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
                documentType: "DebitScheduleTemplate",
                //agg. Required parameter indicating a search instead of a create
                queryCriteria: 0
            }
        });
        return proxy;
    }
});