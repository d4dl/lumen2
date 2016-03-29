Ext.define('Lumen.model.DebitScheduleEntry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'dateToExecute',
            type: 'date',
            convert: function(data, record) {
                return (data && data.sec) ? new Date(data.sec * 1000) : (data ? new Date(data * 1000) : null);
            },
            serialize: function(value, record) {
                return value;
            }
        },
        {
            name: 'executedDate',
            type: 'date',
            convert: function(data, record) {
                return (data && data.sec) ? new Date(data.sec * 1000) : (data ? new Date(data * 1000) : null);
            },
            serialize: function(value, record) {
                return value;
            }
        },
        {name: "debitAmount", type: "float"},
        {name: "debitType", type: "string"}
    ],
    belongsTo: [{
        name: 'debitScheduleEntries',
        model: 'DebitSchedule',
        associationKey: 'debitScheduleEntries'
    }]
});