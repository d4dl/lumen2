Ext.define('Lumen.model.Principal', {
    extend: 'Ext.data.Model',
    fields: ['_id.$id', 'login.username', 'firstName', 'email', 'login.groups'],
    idProperty: '_id.$id'
});