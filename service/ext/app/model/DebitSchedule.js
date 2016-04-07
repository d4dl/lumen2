Ext.define('Lumen.model.DebitSchedule', {
    extend: 'Ext.data.Model',
    requires: ['Lumen.model.DebitScheduleEntry', 'Lumen.model.Fee'],
    idProperty: 'id',
    fields: [
        {
            name: 'name'
        },
        {
            name: 'manual'
        },
        {
            name: 'planTotal'
        },
        {
            name: 'downPaymentAmount'
        },
        {
            name: 'description'
        },
        {
            name: 'active'
        },
        {
            name: 'chargeType'
        }
    ],
    hasMany: [{model: 'Lumen.model.DebitScheduleEntry', name: 'debitEntries'},
              {model: 'Lumen.model.Fee', name: 'fees'}]

});