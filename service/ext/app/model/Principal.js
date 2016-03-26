Ext.define('Lumen.model.Principal', {
    extend: 'Ext.data.Model',
    fields: ['id', 'login.username', 'firstName', 'email', 'login.groups'],
    idProperty: 'id'
});