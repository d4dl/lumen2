Ext.define('Lumen.model.AdmissionApplication',{
    extend: 'Ext.data.Model',
    idProperty: '_id.$id',
    fields: [
        {name: 'ApplicationType'},
        {name: 'Status'},
        {name: 'DateSubmitted'},
        {name: 'ChildId'},
        {name: 'AmountPaid', convert: function(value, record) {
            if(value) {
                return "$" + new Number(value/100).toFixed(2);
            }
        }}
    ]
});
