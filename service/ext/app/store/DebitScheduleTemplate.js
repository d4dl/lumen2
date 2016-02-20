Ext.define('Lumen.store.DebitScheduleTemplate', {
    extend: 'Lumen.store.DebitSchedule',
    createProxy: function () {
        var proxy = this.callParent(arguments);
        Ext.apply(proxy, {
            extraParams: {
                documentType: "DebitScheduleTemplate",
                queryCriteria: 0
            }
        });
        return proxy;
    }
});