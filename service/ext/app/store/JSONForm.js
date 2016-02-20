Ext.define('Lumen.store.JSONForm', {
    extend: 'Ext.data.Store',
    model: 'Lumen.model.JSONForm',
    storeId: 'JSONForm',
    idProperty: '_id.$id',
    remoteSort: true,
    constructor: function (config) {
        this.fields = {};
        //This overrides the models proxy if it has one.
        this.proxy = {
            type: 'ajax',
            url: Lumen.DATA_SERVICE_URL_ROOT + '/documentService.php',
            reader: {
                type: 'json',
                idProperty: '_id.$id'
            }
        }
        this.callParent(arguments);
    },

    removeAll: function() {
        return this.callParent(arguments);
    },
    removeAt: function() {
        return this.callParent(arguments);
    },

    getOrCreateFormData: function() {
        var applicationData = this.first();
        if(!applicationData) {
            this.add(Ext.create("Lumen.model.JSONForm"));
            applicationData = this.first();
        }
        return applicationData = applicationData.raw || applicationData.data;
    },
    load: function(options) {
        return this.callParent(arguments);
    }
});