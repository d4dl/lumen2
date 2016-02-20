
//The Store contains the AjaxProxy as an inline configuration
var store = Ext.define('Lumen.store.Authentication', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.Principal',
    constructor: function(config) {
        //When this is loaded the user should already have a session
        this.proxy = {
            type: 'ajax',
                url : Lumen.DATA_SERVICE_URL_ROOT + '/authenticate.php',
                reader: {
                type: 'json',
                idProperty: '_id.$id'
            }
        }
        this.callParent(arguments);
    },


    listeners: {
        load: function(store, records, successful, eOpts ) {
            Lumen.getApplication().fireEvent(Lumen.AUTHENTICATION_READY, {store: store});
        }
    }
});