Ext.define('Lumen.model.Fee', {
    extend: 'Ext.data.Model',
    //fields: ['FirstName'],
    idProperty: 'id',
    fields: [
        {name: "name", type: "string"},
        {name: "amount", type: "float"}
    ]
});