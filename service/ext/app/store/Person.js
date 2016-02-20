
//The Store contains the AjaxProxy as an inline configuration
var store = Ext.define('Lumen.store.Person', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.Person',
    remoteSort: true,
    pageSize: 10,
    sorters: [
        {
            property: 'FirstName',
            direction: 'DESC'
        }
    ]
});