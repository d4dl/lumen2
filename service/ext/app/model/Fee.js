Ext.define('Lumen.model.Fee', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: "name", type: "string"},
        {name: "amount", type: "float"}
    ]
});