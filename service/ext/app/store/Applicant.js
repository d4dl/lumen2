
//The Store contains the AjaxProxy as an inline configuration
var store = Ext.define('Lumen.store.Applicant', {
    extend: 'Ext.data.Store',
    idProperty: '_id.$id',
    model: 'Lumen.model.Applicant',
    remoteSort: true,
    pageSize: 10,
    sorters: [
        {
            property: 'FirstName',
            direction: 'DESC'
        }
    ]
});