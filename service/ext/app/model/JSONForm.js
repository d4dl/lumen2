Ext.define('Lumen.model.JSONForm',{
    extend: 'Ext.data.Model',
    idProperty: '_id.$id',
    fields: [
        {name: 'applicationType', name: 'applicationId'}
    ]
});
