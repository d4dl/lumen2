Ext.define('Lumen.store.DebitSchedule', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.DebitSchedule',
    proxy: {
        type: 'ajax',
        url: Lumen.DATA_SERVICE_URL_ROOT + "/financeService.php",
        reader: {
            type: 'json',
            idProperty: 'id'
        }
    },
    constructor: function (config) {
        this.callParent(arguments);
    },
});