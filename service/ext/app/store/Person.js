
//The Store contains the AjaxProxy as an inline configuration
var store = Ext.define('Lumen.store.Person', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.Person',
    remoteSort: true,
    pageSize: 10,
    constructor: function (config) {

        //buffered: true,
        //This overrides the models proxy if it has one.
        this.proxy = {
            type: 'ajax',
            url : Lumen.DATA_SERVICE_URL_ROOT + '/userService.php',
            reader: {
                root: 'content',
                type: 'json',
                totalProperty: 'totalElements',
                successProperty: "success"
            }
        }
        this.callParent(arguments);
    },
    sorters: [
        {
            property: 'firstName',
            direction: 'DESC'
        }
    ]
});