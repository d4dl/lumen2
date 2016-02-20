Ext.define('Lumen.store.AdmissionApplicationList', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.AdmissionApplication',
    remoteSort: true,
    pageSize: 10,
    constructor: function (config) {

        //buffered: true,
        //This overrides the models proxy if it has one.
        this.proxy = {
            type: 'ajax',
            url: Lumen.DATA_SERVICE_URL_ROOT + '/applicationFinder.php',
            extraParams: {
                fields: JSON.stringify({
                    "Child": {
                        "Person.FirstName": true,
                        "Person.LastName": true
                    },
                    "AdmissionApplication": {
                        Age: true,
                        AmountPaid: true,
                        Status: true,
                        ChildId: true,
                        ParentIds: true
                     }
                })
            },
            reader: {
                idProperty: '_id.$id',
                root: 'applications',
                type: 'json',
                totalProperty: 'totalCount',
                successProperty: "success"
            }
        }
        this.callParent(arguments);
    },

    sorters: [
        {
            property: 'firstname',
            direction: 'DESC'
        }
    ]
});