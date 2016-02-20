Ext.define('Lumen.model.Principal', {
    extend: 'Ext.data.Model',
    fields: ['_id.$id', 'Login.Username', 'Person.FirstName', 'Person.Email', 'Login.Groups'],
    idProperty: '_id.$id'
});