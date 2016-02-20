Ext.define('Lumen.store.RestStore', {
    extend: 'Ext.data.Store',
    createProxy: function () {
        var proxy =  {
            type: 'rest',
            reader: {
                type: 'json'
            },
            headers: {
                "Authorization": "Basic cXVpY2ttaXQ6cXVpY2ttaXQ="
            }
        };
        return proxy;
    }
});