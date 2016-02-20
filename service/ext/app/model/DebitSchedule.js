Ext.define('Lumen.model.DebitSchedule', {
    extend: 'Ext.data.Model',
    requires: ['Lumen.model.DebitScheduleEntry', 'Lumen.model.Fee'],
    idProperty: 'id',
    fields: [
        {
            name: 'name'
        },
        {
            name: 'templateRole'
        },
        {
            name: 'totalDue'
        },
        {
            name: 'downPaymentAmount'
        },
        {
            name: 'OwnerId'
        },
        {
            name: 'applicationId'
        },
        {
            name: 'description'
        },
        {
            name: 'ChildId'
        },
        {
            name: 'isActive'
        },
        {
            name: 'chargeType'
        }
    ],
    hasMany: [{model: 'Lumen.model.DebitScheduleEntry', name: 'debitScheduleEntries'},
              {model: 'Lumen.model.Fee', name: 'fees'}]

});